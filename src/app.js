import Vue from 'vue'
import Vuetify from 'vuetify'

import App from './App.vue'
import store from './store/index'
import router from './init/router'

import {sync} from 'vuex-router-sync'
sync(store, router)

Vue.use(Vuetify)

require('./init/components.js')
require('./init/filters.js')
require('./init/translations.js')

const app = new Vue(Vue.util.extend({
    router,
    store
}, App))

export {app, router, store}
