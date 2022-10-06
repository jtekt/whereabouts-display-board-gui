import Vue from 'vue'
import Router from 'vue-router'
import Whereabouts from './views/Whereabouts.vue'
import Groups from './views/Groups.vue'
import About from './views/About.vue'
// import ClientConfig from './views/ClientConfig.vue'

Vue.use(Router)


export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/groups',
      alias: '/',
      name: 'groups',
      component: Groups
    },
    {
      path: '/groups/:group_id',
      name: 'whereabouts',
      component: Whereabouts
    },
    // {
    //   path: '/client_config',
    //   name: 'client_config',
    //   component: ClientConfig
    // },
    {
      path: '/about',
      name: 'about',
      component: About
    },

  ],

})
