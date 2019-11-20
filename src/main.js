import 'url-search-params-polyfill';
import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue'
import App from './App.vue'
import VueCookies from 'vue-cookies'
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client'
import router from './router'

const socket = io('https://whereabouts.aws.jtekt.maximemoreillon.com');

Vue.use(VueSocketIOExt, socket);

Vue.use(VueCookies)

VueCookies.config('100d')


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
