let fs = require('fs');
let path = require('path');

let MergeTrees = require('broccoli-merge-trees');
let Plugin = require('broccoli-caching-writer');
let Directory = require('broccoli-source').UnwatchedDir;
let glob = require('glob-fs')({gitignore: true});
let mkdirp = require('mkdirp');
let RSVP = require('rsvp');
let SVGSpriter = require('svg-sprite');
let File = require('vinyl');

SvgSpriteCompiler.prototype = Object.create(Plugin.prototype);
SvgSpriteCompiler.prototype.constructor = SvgSpriteCompiler;

function SvgSpriteCompiler(inputNodes, options) {
    Plugin.call(this, inputNodes, {
        annotation: options.annotation
    });

    this.options = options;
}

SvgSpriteCompiler.prototype.build = function () {
    if (!this._compiled) {
        this._compiled = true;
        return this._compile();
    } else {
        return new RSVP.Promise(function (resolve) {
            resolve();
        });
    }
};

SvgSpriteCompiler.prototype._compile = function () {
    let options = this.options;
    let outputPath = this.outputPath;

    return new RSVP.Promise(function (resolve, reject) {
        let spriter = new SVGSpriter(options);
        let files = glob.readdirSync(options.inputPath + '/*.svg');

        files.forEach(f => {
            let file = new File({
                base: options.inputPath,
                path: f,
                contents: new Buffer(fs.readFileSync(f, {encoding: 'utf-8'}))
            });

            spriter._queue.add(file);
        });

        spriter.compile(function (error, result, /* data */) {
            if (error) {
                reject(error);
            } else {
                for (let mode in result) {
                    for (let resource in result[mode]) {
                        let descriptor = result[mode][resource];
                        let fileName = path.basename(descriptor.path);
                        let destFile = path.join(outputPath, 'assets', fileName);

                        if (resource === 'styl') {
                            destFile = descriptor.path
                        }

                        mkdirp.sync(path.dirname(destFile));
                        fs.writeFileSync(destFile, descriptor.contents);
                    }
                }

                resolve();
            }
        });
    });
};

module.exports = {
    name: 'ember-cli-svg-sprite',

    included: function (app) {
        this.options = app.options.svgSprite;

        this._super.included.apply(this, arguments);

        if (this.options) {
            app.registry.add('template', {
                name: 'ember-cli-svg-sprite',
                ext: 'svg',
                toTree: (tree) => this.treeForPublic(tree)
            })
        }
    },

    treeForPublic: function (tree) {
        if (!this._tree) {
            let options = this.options;
            let inputNode = new Directory(options.inputPath);

            this._tree = new SvgSpriteCompiler([inputNode], options);
        }

        return MergeTrees([this._tree, tree].filter(t => t), {
            description: 'MergeTrees (svg-sprite)'
        });
    },
};
