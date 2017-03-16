import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VeeValidate from 'vee-validate'

let en = require('../store/lang/en.json'),
    pl = require('../store/lang/pl.json'),
    de = require('../store/lang/de.json'),
    es = require('../store/lang/es.json');

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
    },
    errorBagName: 'verrors'
})
