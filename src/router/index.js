import Vue from 'vue'
import Router from 'vue-router'

import Index from '../views/Index.vue'
import Credits from '../views/Credits.vue'
import Login from '../views/Login.vue'
import Services from '../views/Services.vue'
import Vps from '../views/Vps.vue'
import Tickets from '../views/Tickets.vue'
import Ticket from '../views/Ticket.vue'
import Payments from '../views/Payments.vue'
import Profile from '../views/Profile.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
      //no auth needed
      { path: '/', component: Index },
      { path: '/home', component: Index },
      { path: '/:lg/home', component: Index },
      { path: '/credits', component: Credits},
      { path: '/:lg/credits', component: Credits},
      { path: '/login', component: Login},
      { path: '/:lg/login', component: Login},
      //auth needed
      { path: '/:lg/service', component: Services},
      { path: '/:lg/service/vps/:id', component: Vps},
      { path: '/:lg/ticket', component: Tickets},
      { path: '/:lg/ticket/:id', component: Ticket},
      { path: '/:lg/payment', component: Payments},
      { path: '/:lg/profile', component: Profile},
  ]
})
