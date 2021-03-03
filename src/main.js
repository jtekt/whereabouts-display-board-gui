import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueCookies from 'vue-cookies'

import axios from 'axios'
import VueAxios from 'vue-axios'

import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'

import Loader from '@moreillon/vue_loader'


VueCookies.config('100d')

const socket = io(`${process.env.VUE_APP_WHEREABOUTS_API_URL}`)

Vue.use(VueSocketIOExt, socket)

Vue.use(VueCookies)
Vue.use(VueAxios, axios)


// Registering components
Vue.component('Loader', Loader)

Vue.config.productionTip = false


socket.on('connect', () => {
  const jwt = VueCookies.get('jwt')
  if(!jwt) {
    console.error(`Token not found in cookies`)
    return
  }
  socket.emit('authentication', {jwt})
})
socket.on('disconnect', () => {
  store.commit('set_connected',false)
})
socket.on('authenticated', () => {
  store.commit('set_connected',true)
})

// DEBUG
/*
socket.on('debug', (message) => {
  console.log(message)
})
*/

router.beforeEach((to, from, next) => {

  // Set JWt in cookie if passed as query parameter
  let query_jwt = to.query.jwt
  || to.query.token

  if(query_jwt) {
    VueCookies.set("jwt", query_jwt, '14d', null, process.env.VUE_APP_COOKIE_DOMAIN, null, 'Strict')
  }


  let jwt = VueCookies.get('jwt')

  if (jwt) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`

    // get employee number
    axios.get(`${process.env.VUE_APP_AUTHENTICATION_API_URL}/whoami`)
      .then(response => {
        store.commit('set_current_user', response.data)
        next()
      })
      .catch(error => {

        if (error.response){
          alert(error.response.data)
          console.log(error.response.data)
        }
        else {
          alert('Cannot authenticate user')
          console.log(error)
        }
      })
  }
  else {
    // Unset the authorization header
    delete axios.defaults.headers.common['Authorization']
    console.error('User is not logged in')

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
