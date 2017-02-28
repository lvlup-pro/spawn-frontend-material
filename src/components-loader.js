import Components from './components/index'

//load components
//source: https://github.com/vuetifyjs/vuetify/blob/master/src/index.js
function plugin (Vue) {
    Object.keys(Components).forEach(key => {
        Vue.component(`${key}`, Components[key])
    })
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin)
}

export default plugin
