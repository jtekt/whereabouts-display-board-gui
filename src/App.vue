<template>
  <div id="app">

    <div class="header">

      <div class="signature">

        <img src="https://cdn.maximemoreillon.com/logo/logo.svg" alt="">
        <div class="software_info">
          <div class="">行先掲示板 v2.0</div>
          <div class="">Maxime MOREILLON</div>

        </div>
      </div>

      <div class="" v-if="user">
        Logged in as {{user.name_kanji}}
        <button type="button" v-on:click="logout()">Logout</button>
      </div>
      <!-- THIS WILL STAY FOREVER IF NOT LOGGED IN -->
      <div class="" v-else>
        Not logged in (yet)
      </div>

    </div>

    <!-- login form -->
    <form v-if="!user" class="" v-on:submit.prevent="login">
      <input type="text" ref="email_input" placeholder="e-mail address">
      <input type="password" ref="password_input" placeholder="password">
      <input type="submit" value="login">
    </form>

    <!-- visible only if logged in -->
    <div class="" v-if="user">

      <!-- Node selector -->
      <div class="node_selector_wrapper">
        <div class="node_selector" v-if="node_selector_visible">

          <!-- display the nodes (Recursive) -->
          <CorporateStructureNode
            v-on:select_node="select_node($event)"
            v-for="division in company_structure"
            v-bind:node_data="division"/>

        </div>

        <!-- open or close group selector -->
        <div class="node_selector_handle_container">
          Group selection <button type="button" v-on:click="node_selector_visible = !node_selector_visible">{{node_selector_button_text}}</button>
        </div>
      </div>


      <!-- the whereabouts themselves -->
      <div class="" v-if="employees.length > 0">

        <!-- Name of the node -->
        <div class="node_name" v-if="node">{{node.properties.name}}</div>

        <Employee
          v-for="employee in employees"
          v-bind:employee="employee"/>
      </div>
      <div class="" v-else>
        No employees
      </div>


    </div>



  </div>
</template>

<script>
import Employee from '@/components/Employee.vue'
import CorporateStructureNode from '@/components/CorporateStructureNode.vue'

export default {
  name: 'app',
  components: {
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


    }
  },
  sockets: {
    connect() {
      console.log('socket connected to external server')
      if(this.$cookies.get('jwt')){
        console.log("JWT is present in cookies")
        this.$socket.client.emit('token_authentication', {
          jwt: this.$cookies.get('jwt')
        })
      }
    },
    unauthorized(data) {
      console.log("unauthorized")
      alert(data)
    },
    authenticated(data) {
      console.log("authenticated")

      // Get user info
      if('user' in data){
        console.log('Received user info')
        this.user = data.user;
      }

      // Save the JWT
      if('jwt' in data){
        console.log("Received a JWT, storing in cookies")
        this.$cookies.set('jwt', data.jwt)
      }

      // Get company structure
      // MOVE THIS TO WHEN SELECTOR IS ACCESSED!
      this.$socket.client.emit('get_company_structure', {})

      // Get employees if node_id provided
      const params = new URLSearchParams(location.search)
      if(params.get('node_id')){
        console.log("node_id present in query parameters, requesting employees")
        this.$socket.client.emit('get_employees_belonging_to_node', params.get('node_id'))
      }

    },
    internal_server_connected(data){
      console.log("internal_server_connected")
    },
    internal_server_disconnected(data){
      console.log("internal_server_disconnected")
    },
    company_structure(data){
      this.company_structure = data;
    },
    delete_and_create_all(data) {
      console.log(data)
      this.node = data.node;
      this.delete_all();
      this.add_or_update_some(data.employees);
    },
    add_or_update_some(data) {
      this.add_or_update_some(data);
    },
  },
  methods: {
    login(){
      this.$socket.client.emit('credentials_authentication', {
        credentials: {
          email: this.$refs.email_input.value,
          password: this.$refs.password_input.value,
        }
      } )
    },
    logout(){
      this.$cookies.remove('jwt')
      this.user = null;
    },
    delete_all: function(){
      this.employees.splice(0,this.employees.length);
    },
    add_or_update_some: function(incoming_member_array){
      for(var i=0; i<incoming_member_array.length; i++){
        var member_exists = false;
        for(var j=0; j<this.employees.length; j++){
          if(incoming_member_array[i].employee_number === this.employees[j].employee_number){
            member_exists = true;
            this.$set(this.employees,j,incoming_member_array[i])
            break;
          }
        }
        // If the member does not exist, create it
        if(!member_exists) this.employees.push(incoming_member_array[i])
      }
    },
    select_node(node_id){

      window.history.pushState("", "", "/?node_id="+node_id);
      const params = new URLSearchParams(location.search)
      this.$socket.client.emit('get_employees_belonging_to_node', params.get('node_id'))

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
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

.header{
  background-color: #444444;
  color: white;
  padding: 10px;

  display: flex;
  justify-content: space-between;
}

.signature{
  display: flex;
}
.signature img {
  height: 40px;

}

.software_info {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.node_name {
  font-size: 5vmin;
  text-align: center;
  margin: 5px;
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




</style>
