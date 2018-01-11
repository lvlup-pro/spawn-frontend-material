# LVL UP Spawn v3 - frontend (RC)
> Material edition

[![Build Status](https://travis-ci.org/lvlup-pro/spawn-frontend-material.svg?branch=master)](https://travis-ci.org/lvlup-pro/spawn-frontend-material)
[![Code Climate](https://codeclimate.com/github/lvlup-pro/spawn-frontend-material/badges/gpa.svg)](https://codeclimate.com/github/lvlup-pro/spawn-frontend-material)
[![Dependencies](https://david-dm.org/lvlup-pro/spawn-frontend-material/status.svg)](https://david-dm.org/lvlup-pro/spawn-frontend-material)
[![DependenciesDev](https://david-dm.org/lvlup-pro/spawn-frontend-material/dev-status.svg)](https://david-dm.org/lvlup-pro/spawn-frontend-material?type=dev)

Frontend for https://lvlup.pro hosting customer panel available @ https://my.lvlup.pro 

[![Watch the demo video](https://systemz.pl/ext/github/spawn3-frontend.gif)](https://systemz.pl/ext/github/spawn3-frontend.mp4)

*Click image to watch full version*
*(Video is showing beta version)*

## How to play with current release
 
To see sandbox of current version just go to https://demomy.lvlup.pro

You can use credentials generated at this link https://demoapi.lvlup.pro/v3/auth/register

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

### package.json

#### dependencies section

All dependencies for spawn-frontend

#### dev dependencies section

All dependencies from vue-cli template

### Dev server on LAN

Can be nice if you want to check progress on mobile.
Just change 

`var server = app.listen(port)` 

to 

`var server = app.listen(port,"0.0.0.0")` 

in `build/dev-server.js`

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

### Boilerplate update

[Current commit link](https://github.com/vuetifyjs/pwa/commit/5c980b330c3144df4144c2898af4e757ebba9abb)

Generate new project using vuetify PWA template https://github.com/vuetifyjs/pwa/
Move existing:
- src/*
- static/*
- index.html
- LICENSE
- README.md
to new template folder and commit in git
Remember to also tune dependencies section in package.json, all dev dependencies are from template 

Add `noParse: [/moment.js/],` to `module` section in `build/webpack.base.conf.js` file to shrink build
https://github.com/webpack/webpack/issues/198

### Fast icon and assets update

https://realfavicongenerator.net and `cli-real-favicon` npm package

## How to contribute

- Submit bug reports at [issues page](https://github.com/lvlup-pro/spawn-frontend-material/issues)
- Submit PR with fixes 

## TODO

- Check PWA icons on Apple devices 

## License

MIT

## Powered by

https://vuejs.org/

https://vuetifyjs.com/

https://github.com/vuejs/vuex

https://github.com/mzabriskie/axios