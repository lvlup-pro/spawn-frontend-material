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
        header_ticket_init: 'Ticket',
        header_ticket: 'Ticket #{id}',
        header_tickets: 'Tickets',
        header_vps_init: 'VPS',
        header_vps: 'VPS #{id}',
        header_payments: 'Payments',
        header_profile: 'Profile'
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
        header_ticket_init: 'Zgłoszenie',
        header_ticket: 'Zgłoszenie #{id}',
        header_tickets: 'Zgłoszenia',
        header_vps_init: 'VPS',
        header_vps: 'VPS #{id}',
        header_payments: 'Płatności',
        header_profile: 'Profil'
    }
}

// set locales
Object.keys(locales).forEach(function (lang) {
    Vue.locale(lang, locales[lang])
})

const app = new Vue(Vue.util.extend({
    router,
    store
}, App))

export {app, router, store}
