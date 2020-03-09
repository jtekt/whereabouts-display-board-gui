import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

    user: null,
    authenticating: false,

    connection_status: {
      internal_connected: true,
      external_connected: false,
    },

    // Not too fond of having those sparated
    node: null,
    node_id: "",

    employees: [],
    employees_loading: false,
  },
  mutations: {

    // manage user
    update_user_info(state, new_user_info){
      console.log("update user info")
      state.user = new_user_info
    },
    set_authenticating(state, new_authenticating_state){
      state.authenticating = new_authenticating_state
    },

    // Managing connection status
    internal_connection_status(state, connected){
      state.connection_status.internal_connected = connected;
    },
    external_connection_status(state, connected){
      state.connection_status.external_connected = connected;
    },


    // managing node/unit/group info
    update_node_info(state,new_node_info){
      state.node = new_node_info
    },

    set_node_id(state,new_node_id){
      console.log("setting node id")
      state.node_id = new_node_id;

      // Save in cookies
      $cookies.set('node_id', new_node_id)
    },


    // Managing list of employees
    delete_all(state){
      state.employees.splice(0,state.employees.length);
    },
    create_all(state, incoming_employees){
      incoming_employees.forEach(incoming_employee => {
        state.employees.push(incoming_employee)
      })
    },
    update_some(state, incoming_employees){

      // ONLY DEALS WITH LOCATION AND PRESENCE!

      incoming_employees.forEach(incoming_employee => {

        var match = state.employees.find(employee => {
          return employee.employee_number === incoming_employee.employee_number;
        })

        if(match) {
          match.current_location = incoming_employee.current_location;
          match.presence = incoming_employee.presence;
        }

      })
    },
    set_employees_loading(state, loading){
      state.employees_loading = loading;
    },
  },
  actions: {

  }
})
