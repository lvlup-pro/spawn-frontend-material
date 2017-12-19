import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

import App from './App'
import router from './router'

Vue.use(Vuetify)
Vue.config.productionTip = false

/*
All custom code not in the template start
 */

// i18n
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en',
  //messages, // set locale messages
})

// filters
import moment from 'moment'

Vue.filter('prettyDateFormat', function (uts) {
  return moment.unix(uts).format("DD.MM.YYYY")
})
Vue.filter('prettyDateFrom', function (uts) {
  return moment.unix(uts).from()
})
Vue.filter('prettyTimeDate', function (uts) {
  return moment.unix(uts).format("HH:mm DD.MM.YYYY")
})
Vue.filter('prettyDateTime', function (uts) {
  return moment.unix(uts).format("DD.MM.YYYY HH:mm")
})
Vue.filter('secondsToStartDate', function (seconds) {
  let timestampNow = Math.floor(Date.now() / 1000)
  return moment.unix(timestampNow - seconds).format("DD.MM.YYYY HH:mm")
})
Vue.filter('secondsToDays', function (seconds) {
  return Math.floor(seconds / 86400)
})

// forum widget
import DiscourseLatestPosts from './components/DiscourseLatestPosts'

Vue.component('discourse-latest-posts', DiscourseLatestPosts)

// config
Vue.mixin({
  created: function () {
    this.$config = {
      apiUrl: 'https://demoapi.lvlup.pro/v3/'
    }
  }
})

// store for global data
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    loggedIn: false,
    userJustLoggedOff: false,
    language: 'pl'
  },
  actions: {
    checkLanguage({dispatch, state, commit}) {
      //TODO detect browser language
      if (localStorage.getItem('lang') === null) {
        localStorage.setItem('lang', 'pl')
      }
      commit('language', localStorage.getItem('lang'))
      //TODO check race condition
      setTimeout(() => {
        window.vue.$i18n.locale = localStorage.getItem('lang')
      }, 1)
    },
    changeLanguage({dispatch, state, commit}) {
      let lg = 'en'
      if (state.language === 'en') {
        lg = 'pl'
      }
      commit('language', lg)
      localStorage.setItem('lang', lg)
      //TODO check race condition
      setTimeout(() => {
        window.vue.$i18n.locale = lg
      }, 1)
    },
    checkIfLoggedIn({dispatch, state, commit}) {
      if (localStorage.getItem('token') === null) {
        commit('userLogged', false)
        //TODO redirect to destination page
        //TODO inform user about log in requirement
        //TODO check race condition
        setTimeout(() => {
          window.vue.$router.push('/auth/login')
        }, 1)
      } else {
        //TODO check if token is valid
        commit('userLogged', true)
      }
      commit('userJustLoggedOff', false)
    },
    setLoggedIn({dispatch, state, commit}) {
      commit('userLogged', true)
    },
    setLoggedOut({dispatch, state, commit}) {
      localStorage.removeItem('token')
      console.log(window.vue.$router)
      setTimeout(() => {
        window.vue.$router.push('/auth/login')
      }, 250)
      commit('userLogged', false)
      commit('userJustLoggedOff', true)
    },
    setLoggedOutOld({dispatch, state, commit}) {
      commit('userJustLoggedOff', false)
    },
    whenMounted({dispatch, state, commit}) {
      setTimeout(() => {
        let path = 'https://demomy.lvlup.pro' + window.vue.$router.currentRoute.path
        _paq.push(['setCustomUrl', path])
        _paq.push(['trackPageView'])
      }, 0)
    }
  },
  mutations: {
    userLogged(state, newVal) {
      state.loggedIn = newVal
    },
    userJustLoggedOff(state, newVal) {
      state.userJustLoggedOff = newVal
    },
    language(state, newVal) {
      state.language = newVal
    }
  }
})

import 'font-awesome-webpack'
import 'typeface-roboto'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

/*
All custom code not in the template end
Also see Vue instance below:
 */

/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store, //line added to init store
  i18n //line added to init i18n
})

window.vue = vm