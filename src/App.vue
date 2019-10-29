<template>
  <div id="app">

    <form v-if="!authenticated" class="" v-on:submit.prevent="login">
      <input type="email" ref="email_input" placeholder="e-mail address">
      <input type="password" ref="password_input" placeholder="password">
      <input type="submit" value="login">
    </form>

    <div class="" v-else>

      <button type="button" v-on:click="logout()">Logout</button>

      <Employee
        v-for="employee in employees"
        v-bind:employee="employee"/>



    </div>



  </div>
</template>

<script>
import Employee from '@/components/Employee.vue'

export default {
  name: 'app',
  components: {
    Employee,
  },
  data: function(){
    return {
      authenticated: false,
      employees: [],
    }
  },
  sockets: {
    connect() {
      console.log('socket connected to external server')
      if(this.$cookies.get('jwt')){
        console.log("JWT is present in localStorage")
        this.$socket.client.emit('token_authentication', {
          jwt: this.$cookies.get('jwt')
        } )
      }
    },
    unauthorized(data) {
      console.log(data)
    },
    authenticated(data) {
      console.log(data)
      this.authenticated = true;
      if('jwt' in data){
        console.log("Received a JWT, storing in localStorage")
        this.$cookies.set('jwt', data.jwt)
      }
      this.$socket.client.emit('get_employees_belonging_to_node', "134121")
    },
    internal_server_connected(data){
      console.log("internal_server_connected")
    },
    internal_server_disconnected(data){
      console.log("internal_server_disconnected")
    },
    delete_and_create_all(inbound_JSON_message) {
      this.delete_all();
      this.add_or_update_some(inbound_JSON_message);
    },
    add_or_update_some(inbound_JSON_message) {
      this.add_or_update_some(inbound_JSON_message);
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
      this.authenticated = false;
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
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
</style>
