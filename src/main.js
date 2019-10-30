import 'url-search-params-polyfill';
import Vue from 'vue'
import App from './App.vue'
import VueCookies from 'vue-cookies'
import VueSocketIOExt from 'vue-socket.io-extended';


import io from 'socket.io-client'



const socket = io('https://whereabouts.aws.jtekt.maximemoreillon.com');

Vue.use(VueSocketIOExt, socket);

Vue.use(VueCookies)

VueCookies.config('7d')


Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
