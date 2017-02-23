import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import store from './store/index'
import router from './router/index'
import {sync} from 'vuex-router-sync'
import VueI18n from 'vue-i18n'
import Components from './components-loader'
sync(store, router)

Vue.use(Vuetify)
Vue.use(Components)

Vue.use(VueI18n)
Vue.locale('pl', require('./store/lang/pl.json'))
Vue.locale('en', require('./store/lang/en.json'))

const app = new Vue(Vue.util.extend({
    router,
    store
}, App))

export {app, router, store}
