import 'url-search-params-polyfill';
import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue'
import App from './App.vue'
import VueCookies from 'vue-cookies'
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client'
import router from './router'
import store from './store'


const socket = io('https://whereabouts.aws.jtekt.maximemoreillon.com');

Vue.use(VueSocketIOExt, socket);

Vue.use(VueCookies)

VueCookies.config('100d')


Vue.config.productionTip = false

/*
router.beforeEach((to, from, next) => {
  // Authentication
  if(to.path !== '/login'){
    if(!store.state.user) next('/login');
    else next();
  }
  else next();


});
*/

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
