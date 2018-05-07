ember-cli-svg-sprite
==============================================================================

This is an integration with [svg-sprite](https://www.npmjs.com/package/svg-sprite) npm package. It is mainly used to generate `.svg` sprite 
and companion `.styl` file for easy icon usage in html.

Installation
------------------------------------------------------------------------------

```
ember install ember-cli-svg-sprite
```

Usage
------------------------------------------------------------------------------

1) You would need to place your svg files under `/app/icons`

2) Have a icon stylus template inside your project, for example under `/app/styles/vendor/sprite-template.hbs`. Example:

```
{{mixinName}}() {
    background-image: url("./{{{sprite}}}");
    background-size: rem({{spriteWidth}}) rem({{spriteHeight}});
}

{{#shapes}}
{{#selector.shape}}{{#escape}}
.i-{{expression}} {
    {{mixinName}}();
    {{/escape}}{{^last}},{{/last}}{{/selector.shape}}width: rem({{width.outer}});
    height: rem({{height.outer}});
    background-position: rem({{position.absolute.x}}) rem({{position.absolute.y}});
}
{{/shapes}}
```

Reference: 

3) In your `ember-cli-build.js` you would need to add a configuration. Example:
 
```
    svgSprite: {
      inputPath: 'app/icons',

      log: 'debug',
      mode: {
        css: {
          bust: false,
          prefix: '',
          dest: 'dist/assets',
          common: '',
          sprite: 'sprite.svg',
          mixin: 'sprite',
          dimensions: 'inline',
          render: {
            styl: {
              template: 'app/styles/vendor/sprite-template.hbs',
              dest: '../../app/styles/vendor/sprites.styl'
            }
          }
        },
        symbol: {
          bust: false,
          prefix: '',
          dest: '',
          common: '',
          sprite: 'dist/assets/sprite-symbols.svg'
        }
      }
    }

```

4) In your `.styl` file import the generated styl file. Example: `import "vendor/sprites.styl"`

5) Run `ember build` and observe the generated `sprites.svg`, `sprite-symbols.svg` and icon classes in your css.

This configuration will generate


Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-cli-svg-sprite`
* `npm install`

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
