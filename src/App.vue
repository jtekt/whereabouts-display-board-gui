<template>
  <!-- everything needs to be inside app to the reactive -->
  <div id="app">

    <AppTemplate
      applicationName="行先掲示板"
      v-bind:navigation="navigation"/>

  </div>
</template>

<script>
import AppTemplate from '@/components/jtekt_vue_template/AppTemplate.vue'

export default {
  name: 'app',
  components: {
    AppTemplate
  },
  data(){
    return{
      navigation : [
        /*
        {route: '/', label: 'List', icon: 'format-list-bulleted'},
        {route: '/inbox', label: 'Inbox', icon: 'inbox-arrow-down'},
        */
      ],
      connection_status: {
        internal_connected: true,
        external_connected: false,
      },
    }
  },
  sockets: {
    connect() {
      console.log('socket connected to external server')
      this.connection_status.external_connected = true;
      // Check if JWT present in query
      const params = new URLSearchParams(location.search)
      if(params.get('jwt')) this.$cookies.set('jwt', params.get('jwt'))
      // Check if possible to authentify using a JWT
      if(this.$cookies.get('jwt')){
        console.log("JWT is present in cookies")
        this.logging_in = true;
        this.$socket.client.emit('token_authentication', {
          jwt: this.$cookies.get('jwt')
        })
      }
    },
    disconnect(){
      console.log('socket disconnected from external server')
      this.connection_status.external_connected = false;
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
      // Get employees
      this.get_employees()
    },
    internal_server_connected(data){
      console.log("internal_server_connected")
      this.connection_status.internal_connected = true;
      // Get employees
      this.get_employees()
    },
    internal_server_disconnected(data){
      console.log("internal_server_disconnected")
      this.connection_status.internal_connected = false;
    },
    /*
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
      this.update_some(data.employees);
    },
    */
  },
}
</script>

<style>







</style>
