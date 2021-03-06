import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Profile from '@/components/Profile'
import Services from '@/components/Services'
import Vps from '@/components/Vps'
import VpsAttacks from '@/components/VpsAttacks'
import VpsUdpFilters from '@/components/VpsUdpFilters'
import Payments from '@/components/Payments'
import Tickets from '@/components/Tickets'
import Ticket from '@/components/Ticket'
import Login from '@/components/Login'
import Order from '@/components/Order'
import NotFound from '@/components/NotFound'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/services',
      name: 'Services',
      component: Services
    },
    {
      path: '/service/vps/:id',
      name: 'Vps',
      component: Vps
    },
    {
      path: '/service/vps/:id/ip/:ip/attacks',
      name: 'VpsAttacks',
      component: VpsAttacks
    },
    {
      path: '/service/vps/:id/ip/:ip/filter',
      name: 'VpsUdpFilters',
      component: VpsUdpFilters
    },
    {
      path: '/payments',
      name: 'Payments',
      component: Payments
    },
    {
      path: '/tickets',
      name: 'Tickets',
      component: Tickets
    },
    {
      path: '/ticket/:id',
      name: 'Ticket',
      component: Ticket
    },
    {
      path: '/auth/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/order',
      name: 'Order',
      component: Order
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})
