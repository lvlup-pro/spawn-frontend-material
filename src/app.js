import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import VeeValidate from 'vee-validate';
import store from './store/index'
import router from './router/index'
import {sync} from 'vuex-router-sync'
import VueI18n from 'vue-i18n'
sync(store, router)

Vue.use(Vuetify)

//-------------------- components --------------------
import ProgressLinearColor from './components/ProgressLinearColor.vue'
import TextInput from './components/TextInput.vue'

Vue.component('progress-linear-color', ProgressLinearColor)
Vue.component('text-input', TextInput)

//-------------------- i18n --------------------
let en = require('./store/lang/en.json'),
    pl = require('./store/lang/pl.json'),
    de = require('./store/lang/de.json');

Vue.use(VueI18n)
Vue.locale('en', en)
Vue.locale('pl', pl)
Vue.locale('de', de)

function toLambdas(obj) {
    let newObj = {}
    for (let key in obj) {
        newObj[key] = () => obj[key]
    }
    return newObj
}

Vue.use(VeeValidate, {
    locale: 'en',
    dictionary: {
        pl: {
            messages: toLambdas(pl.validation)
        },
        en: {
            messages: toLambdas(en.validation)
        },
        de: {
            messages: toLambdas(en.validation)
        }
    }
})

//-------------------- create app --------------------
const app = new Vue(Vue.util.extend({
    router,
    store
}, App))

export {app, router, store}
