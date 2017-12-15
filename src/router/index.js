import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Services from '@/components/Services'
import Payments from '@/components/Payments'
import Tickets from '@/components/Tickets'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/services',
      name: 'Services',
      component: Services
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
      path: '/auth/login',
      name: 'Login',
      component: Login
    }
  ]
})
