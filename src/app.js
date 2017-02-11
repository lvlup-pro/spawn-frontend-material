import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import store from './store/index'
import router from './router/index'
import {sync} from 'vuex-router-sync'
import VueI18n from 'vue-i18n'

sync(store, router)

Vue.use(Vuetify)

Vue.use(VueI18n)
var locales = {
    en: {
        loading: "Loading",
        auth_no: "Log in first",
        auth_already: 'Logged in already',
        auth_success: 'Auth success',
        auth_fail: 'Login failed',
        header_home: 'Home',
        header_login: 'Log in',
        header_services: 'Services',
        header_ticket: 'Ticket',
        header_tickets: 'Tickets',
        header_vps: 'VPS'
    },
    pl: {
        loading: "Ładowanie",
        auth_no: "Zaloguj się",
        auth_already: 'Zalogowano już wcześniej',
        auth_success: 'Zalogowano poprawnie',
        auth_fail: 'Logowanie nieudane',
        header_home: 'Nowości',
        header_login: 'Zaloguj się',
        header_services: 'Usługi',
        header_ticket: 'Zgłoszenie',
        header_tickets: 'Zgłoszenia',
        header_vps: 'VPS'
    }
}

// //http://stackoverflow.com/a/26889118/1351857
// var lang = window.navigator.languages ? window.navigator.languages[0] : null;
// lang = lang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;
//
// if (lang.indexOf('-') !== -1)
//     lang = lang.split('-')[0];
//
// if (lang.indexOf('_') !== -1)
//     lang = lang.split('_')[0];

//localStorage.setItem("lang", lang);
//Vue.config.lang = 'en' //FIXME user should select language
//console.log(router.currentRoute)
//Vue.config.lang = router.params.lang

Vue.config.fallbackLang = 'en'
// set locales
Object.keys(locales).forEach(function (lang) {
    Vue.locale(lang, locales[lang])
})

const app = new Vue(Vue.util.extend({
    router,
    store
}, App))

export {app, router, store}
