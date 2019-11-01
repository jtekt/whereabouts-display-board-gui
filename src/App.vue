<template>
  <div id="app">

    <!-- header bar -->
    <TopBar
      softwareName="行先掲示板 v4.0"
      v-bind:user="user"
      v-on:logout="logout()"/>



    <div class="main">
      <!-- login form -->
      <!-- SHOULD NOT BE SHOWN IF LOGGING IN -->
      <LoginForm
        v-if="!user && !logging_in"
        v-on:login="login($event)"/>

      <!-- visible only if logged in -->
      <div class="" v-if="user">

        <!-- the whereabouts themselves -->
        <div class="" v-if="node && employees.length > 0">

          <!-- Name of the node -->
          <div
            class="group_name_container"
            v-if="node"
            v-on:click="open_node_selector()">
            <div class="group_name" >
              {{node.properties.name}}
            </div>
            <div class="">
              (Click to change)
            </div>
          </div>


          <div class="employees_table">
            <Employee
              v-for="employee in employees"
              v-bind:employee="employee"/>
          </div>

        </div>

        <!-- status messages -->
        <div class="status_message" v-if="node && employees.length === 0">No result</div>
        <div class="status_message" v-else-if="loading_employees">Loading...</div>



      </div>
    </div>



    <Modal
      v-on:close="close_node_selector()"
      v-bind:open="node_selector_visible"
      v-bind:close_button="node">

      <div class="modal_title">
        Group selection
      </div>

      <div class="corporate_structure_container">

        <CorporateStructureNode
        v-on:select_node="select_node($event)"
        v-for="division in company_structure"
        v-bind:node_data="division"/>

      </div>

    </Modal>


  </div>
</template>

<script>
import LoginForm from '@/components/login_form/LoginForm.vue'
import TopBar from '@/components/top_bar/TopBar.vue'

import Modal from '@/components/vue_modal/Modal.vue'

import Employee from '@/components/Employee.vue'
import CorporateStructureNode from '@/components/CorporateStructureNode.vue'

export default {
  name: 'app',
  components: {
    TopBar,
    LoginForm,
    Modal,
    Employee,
    CorporateStructureNode,
  },
  data: function(){
    return {
      user: null,
      node: null,
      employees: [],
      company_structure: [],

      node_selector_visible: false,

      // SUBOPTIMAL
      logging_in: false, // Not used anymore
      loading_employees: false,
    }
  },
  sockets: {
    connect() {
      console.log('socket connected to external server')
      if(this.$cookies.get('jwt')){
        console.log("JWT is present in cookies")
        this.logging_in = true;
        this.$socket.client.emit('token_authentication', {
          jwt: this.$cookies.get('jwt')
        })
      }
    },
    unauthorized(data) {
      console.log("unauthorized")
      this.logging_in = false;
      alert(data)

      this.$cookies.remove('jwt')
      this.user = null;

    },
    authenticated(data) {
      console.log("authenticated")
      this.logging_in = false;

      // Get user info
      if('user' in data) this.user = data.user;

      // Save the JWT
      if('jwt' in data) this.$cookies.set('jwt', data.jwt)

      // Get employees if node_id provided
      this.get_employees_from_node()

    },
    internal_server_connected(data){
      console.log("internal_server_connected")

      // Get employees if node_id provided
      this.get_employees_from_node()
    },
    internal_server_disconnected(data){
      console.log("internal_server_disconnected")
    },
    company_structure(data){
      console.log("Got company structure")
      this.company_structure = data;
    },
    delete_and_create_all(data) {
      console.log("delete_and_create_all")
      // remove loader
      this.loading_employees = false;

      // Save the node info to display the node as title
      this.node = data.node;

      // add employees
      this.delete_and_create_all(data.employees);
    },
    update_some(data) {
      console.log('update_some')
      console.log(data)
      this.update_some(data.employees);
    },

  },
  methods: {
    login(credentials){
      console.log("logging in")
      this.$socket.client.emit('credentials_authentication', {
        credentials: {
          email: credentials.email,
          password: credentials.password,
        }
      } )
    },
    logout(){
      this.$socket.client.emit('logout', {})
    },
    get_employees_from_node(node_id){

      // A BIT DIRTY
      const params = new URLSearchParams(location.search)
      if(params.get('node_id')){
        console.log("node_id present in query parameters, requesting employees")
        this.$socket.client.emit('get_employees_belonging_to_node',params.get('node_id'))
        this.loading_employees = true;
      }
      else {
        console.log("could not find node_id in query, opening group selector")
        this.open_node_selector()
      }

    },
    open_node_selector(){
      // Get company structure
      this.company_structure = [] // Emptying current company structure to get new one
      this.$socket.client.emit('get_company_structure', {})
      this.node_selector_visible = true;
    },
    close_node_selector(){
      // Only allow to close if node selected
      if(this.node){
        this.node_selector_visible = false;
      }

    },
    toggle_node_selector(){
      if(this.node_selector_visible) this.close_node_selector();
      else this.open_node_selector();
    },
    delete_and_create_all(incoming_employees){
      this.employees.splice(0,this.employees.length);
      incoming_employees.forEach(incoming_employee => {
        this.employees.push(incoming_employee)
      })
    },
    update_some(incoming_employees){


      // ONLY DEALS WITH LOCATION AND PRESENCE!
      incoming_employees.forEach(incoming_employee => {

        var match = this.employees.find(employee => {
          return employee.employee_number === incoming_employee.employee_number;
        })

        if(match) {
          // usin set for reactivity
          this.$set(match, 'current_location', incoming_employee.current_location)
          this.$set(match, 'presence', incoming_employee.presence)
        }
      })
    },
    select_node(node_id){

      // update query
      window.history.pushState("", "", "/?node_id="+node_id);

      // get employees corresponding to query
      this.get_employees_from_node()

      // close node selector
      this.node_selector_visible = false;
    },
  },
  computed: {
    node_selector_button_text(){
      if(!this.node_selector_visible) return "⮟"
      else return "⮝"
    },
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  min-height: 100vh;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

.group_name_container {
  text-align: center;
  cursor: pointer;
  margin: 20px;

}
.group_name {
  /* AKA group name */
  font-size: 6vmin;
}

.node_selector_wrapper{
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.node_selector_wrapper > *{
  padding: 10px;

}

.node_selector{
  background-color: #dddddd;
}

.node_selector_handle_container{
  background-color: #dddddd;
}

.employees_table {

  margin-left: 25px;
  margin-right: 25px;
  margin-bottom: 25px;

  /* IE fallback behavior */
  display: flex;
  flex-wrap: wrap;

  /* Normal behavior */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70vmin,1fr));
  grid-column-gap: 20px;
}

.status_message {
  text-align: center;
  margin: 25px;
  font-size: 120%;
}

.corporate_structure_container{
  height: 80vh;
  overflow-y: auto;
}

.modal_window_outer{
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
}

.modal_title {
  padding: 10px;
  font-size: 5vmin;
  text-align: center;
}

</style>
