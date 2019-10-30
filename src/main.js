import Vue from 'vue'
import App from './App.vue'
import VueCookies from 'vue-cookies'
import VueSocketIOExt from 'vue-socket.io-extended';
import Vuex from 'vuex'

import io from 'socket.io-client';
import store from './store'

const socket = io('https://whereabouts.aws.jtekt.maximemoreillon.com');

Vue.use(VueSocketIOExt, socket);
Vue.use(VueCookies)

VueCookies.config('7d')


Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
