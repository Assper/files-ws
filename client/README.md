### Template For Simple Site

#### Requirements
* NodeJS: ^10.0.0
* Git

#### Installation
* Clone or download repo
* Run command inside repo folder: `npm i`

#### Commands
* `npm run build` - build production version
* `npm run build:dev` - build development version
* `npm run dev` - build and run dev server
* `npm run js:analyze` - run js bundle analyzer
* `npm run html:watch` - run watch for template changes
* `npm run css:watch` - run watch for styles changes
* `npm run js:watch` - run watch for scripts changes

Template contain several command for separate build js, css or html and run dev server without build.

#### Usage
All project files contains in src folder and separate by scripts, styles and template folders.
* Use [pug](https://pugjs.org/api/getting-started.html "pug") for build templates
* Use [sass](https://sass-lang.com/documentation "sass") for create styles
* And JS with [babel](https://babeljs.io/docs/en/ "babel") with ES6 modules and features
