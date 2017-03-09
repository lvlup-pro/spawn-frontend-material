import Vue from 'vue'
import Vuetify from 'vuetify'
import VeeValidate from 'vee-validate';
import VueI18n from 'vue-i18n'

import moment from 'moment'

import App from './App.vue'
import store from './store/index'
import router from './init/router'

import {sync} from 'vuex-router-sync'
sync(store, router)

Vue.use(Vuetify)

//-------------------- components --------------------
import ProgressLinearColor from './components/ProgressLinearColor.vue'
import TextInput from './components/TextInput.vue'

Vue.component('progress-linear-color', ProgressLinearColor)
Vue.component('text-input', TextInput)

//-------------------- filters --------------------
Vue.filter('prettyDateFormat', function (uts) {
    return moment.unix(uts).format("DD.MM.YYYY")
})
Vue.filter('prettyDateFrom', function (uts) {
    return moment.unix(uts).from()
})
Vue.filter('prettyDateTime', function (uts) {
    return moment.unix(uts).format("HH:mm DD.MM.YYYY")
})

//-------------------- i18n --------------------
let en = require('./store/lang/en.json'),
    pl = require('./store/lang/pl.json'),
    de = require('./store/lang/de.json'),
    es = require('./store/lang/es.json');

Vue.use(VueI18n)
Vue.locale('en', en)
Vue.locale('pl', pl)
Vue.locale('de', de)
Vue.locale('es', es)

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
        },
        es: {
            messages: toLambdas(es.validation)
        }
    }
})

//-------------------- create app --------------------
const app = new Vue(Vue.util.extend({
    router,
    store
}, App))

export {app, router, store}
