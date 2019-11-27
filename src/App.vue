<template>
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
        {route: '/', label: 'Home', icon: 'home'},
        {route: '/groups', label: 'Groups', icon: 'account-group'},
      ]
    }
  },
  mounted(){
    // Check if node_id is available in cookies
    // If so, set node id accordingly
    if(this.$cookies.get('node_id')){
      console.log("node_id present in cookies, requesting employees")
      this.$store.commit("set_node_id", this.$cookies.get('node_id'))
    }

  },
  sockets: {
    connect() {
      console.log('socket connected to external server')
      this.$store.commit('external_connection_status', true)

      // Authentication using JWT after connection if possible

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

        // Does not need to go to the login screen
      }
      else {
        // if no JWT exists, then the client must authenticate using credentials
        // NOT REALLY CLEAN
        this.$router.push('/login')
      }
      // WILL NOT TRY TO GET EMPLOYEES HERE
    },
    disconnect(){
      console.log('socket disconnected from external server')
      this.$store.commit('external_connection_status', false)
    },
    unauthorized(data) {
      console.log("unauthorized")

      this.$cookies.remove('jwt');
      this.$store.commit('update_user_info', null);
    },
    authenticated(data) {
      console.log("authenticated")

      // Get user info
      if('user' in data) this.$store.commit('update_user_info', data.user);

      // Save the JWT
      if('jwt' in data) this.$cookies.set('jwt', data.jwt)

      // Get employees
      this.$socket.client.emit('get_employees_belonging_to_node',this.$store.state.node_id);

    },
    internal_server_connected(data){
      console.log("internal_server_connected")
      this.$store.commit('internal_connection_status', true);

      // Get employees
      this.$socket.client.emit('get_employees_belonging_to_node',this.$store.state.node_id);
    },
    internal_server_disconnected(data){
      console.log("internal_server_disconnected")
      this.$store.commit('internal_connection_status',false);
    },

    // THOSE EVENTS COULD BE MOVED TO THE HOME VIEW
    delete_and_create_all(data) {
      console.log("delete_and_create_all")

      // add employees
      this.$store.commit('delete_all');
      this.$store.commit('create_all', data.employees);

      // Save the node info to display the node as title
      this.$store.commit('update_node_info', data.node);

    },
    update_some(data) {
      console.log('update_some')
      this.$store.commit('update_some',data.employees);
    },



  },

  methods: {


  }
}
</script>

<style>

.loader {
  margin: 25px;
  width: 20vmin;
  height: 20vmin;
  border-radius: 100%;

  border: 0.5vmin solid white;
  border-color: #444444 transparent #444444 transparent;
  animation-name: loader_rotation;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;

}
@keyframes loader_rotation {
  0% {transform: rotate(0deg);}
  100% {transform: rotate(360deg);}
}

</style>
