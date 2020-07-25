import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueCookies from 'vue-cookies'

import axios from 'axios'
import VueAxios from 'vue-axios'

import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'

//import 'url-search-params-polyfill';
//import '@mdi/font/css/materialdesignicons.css';
//const socket = io(`${process.env.VUE_APP_WHEREABOUTS_API_URL}`);
const socket = io(`http://172.16.98.151:8999/`)

Vue.use(VueSocketIOExt, socket)

Vue.use(VueCookies)
Vue.use(VueAxios, axios)

VueCookies.config('100d')


Vue.config.productionTip = false







// Redirect to authentication manager if not logged in

router.beforeEach((to, from, next) => {
  var jwt = VueCookies.get('jwt')
  if (jwt) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`

    // get employee number
    axios.get(`${process.env.VUE_APP_AUTHENTICATION_API_URL}/whoami`)
      .then(response => {
        next()
      })
      .catch(error => {
        alert('Cannot authenticate user')
        if (error.response) console.log(error.response.data)
        else console.log(error)
      })
  }
  else {
    // Unset the authorization header
    delete axios.defaults.headers.common['Authorization']

    // Redirect to autheirzation ms front end
    // Not needed anymore since now using integrated login form
    // window.location.href = process.env.VUE_APP_AUTHENTICATION_MANAGER_FRONT_URL
  }
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
