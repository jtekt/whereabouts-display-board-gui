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
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import './registerServiceWorker'


VueCookies.config('100d')

const socket = io(`${process.env.VUE_APP_WHEREABOUTS_API_URL}`)

Vue.use(VueSocketIOExt, socket)

Vue.use(VueCookies)
Vue.use(VueAxios, axios)


// Registering components
Vue.component('Loader', Loader)

Vue.config.productionTip = false


socket.on('connect', () => {

  const jwt = VueCookies.get('jwt') ||  localStorage.jwt
  
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


new Vue({
  store,
  router,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
