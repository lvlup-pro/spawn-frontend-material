import Vue from 'vue'
import Router from 'vue-router'

import Index from '../views/Index.vue'
import Login from '../views/Login.vue'
import Services from '../views/Services.vue'
import Tickets from '../views/Tickets.vue'
import Ticket from '../views/Ticket.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
      { path: '/', component: Index },
      { path: '/services', component: Services},
      { path: '/ticket', component: Tickets},
      { path: '/ticket/:id', component: Ticket},
      { path: '/login', component: Login},
  ]
})