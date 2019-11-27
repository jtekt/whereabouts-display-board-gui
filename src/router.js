import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Groups from './views/Groups.vue'
import Login from './views/Login.vue'

Vue.use(Router)




export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/groups',
      name: 'groups',
      component: Groups
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ],

})
