import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    connected: false,
  },
  mutations: {

    set_current_user(state, user){
      state.user = user
    },
    set_connected(state, connected) {
      state.connected = connected
    }

  },
  actions: {

  }
})
