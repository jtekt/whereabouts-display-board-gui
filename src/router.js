import Vue from 'vue'
import Router from 'vue-router'
import Whereabouts from './views/Whereabouts.vue'
import Groups from './views/Groups.vue'

Vue.use(Router)


export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', redirect: '/groups' },
    {
      path: '/groups',
      name: 'groups',
      component: Groups
    },
    {
      path: '/groups/:group_id',
      name: 'whereabouts',
      component: Whereabouts
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('./views/Info.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue')
    },

  ],

})
