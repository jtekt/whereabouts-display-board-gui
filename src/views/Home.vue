<template>
  <div class="home_view">

    <!-- status messages -->
    <div class="status_message" v-if="$store.state.employees_loading">
      <div class="loader"/>
    </div>


    <!-- the whereabouts themselves -->
    <div class="" v-else-if="$store.state.employees.length > 0">

      <!-- Name of the node/group/unit -->
      <div
        v-if="$store.state.node"
        class="group_name_container"
        v-on:click="open_node_selector()">
        <div class="group_name">{{$store.state.node.properties.name}}</div>
      </div>

      <div class="employees_table">
        <Employee
          v-for="employee in ordered_employees"
          v-bind:employee="employee"/>
      </div>

    </div>

    <div class="status_message" v-else>
      No member
    </div>



    <!-- overlay to show connection problems -->
    <DisconnectionWarning/>

  </div>
</template>

<script>

import Employee from '@/components/Employee.vue'
import DisconnectionWarning from '@/components/DisconnectionWarning.vue'

export default {
  name: 'Home',
  components: {
    Employee,
    DisconnectionWarning
  },
  data(){
    return {
      // Employees could actually be managed here
      loading_employees: false, // used to distinguish between having no result or still loading
    }
  },
  computed: {
    ordered_employees() {
      return this.$store.state.employees.sort((a, b) => {
        return a.employee_number - b.employee_number;
      });
    }
  },
  mounted(){
    // The user might have passed the desired node id via query
    const params = new URLSearchParams(location.search)
    if(params.get('node_id')) this.$store.commit("set_node_id", params.get('node_id'))

    if(!this.$store.state.user) this.$router.push('/login');

    // get employees
    // MIGHT NOT BE CONNECTED YET!!
    //this.$socket.client.emit('get_employees_belonging_to_node',this.$store.state.node_id);

  },
  sockets: {
    // Respond to socket events
    // COULD REPSOND TO UPDATE EVENTS HERE
  },
  methods: {
    open_node_selector(){
      this.$router.push("/groups")
    },

  }

}
</script>

<style scoped>

.group_name_container {
  text-align: center;
  cursor: pointer;
  margin: 20px;

}
.group_name {
  font-size: 6vmin;
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
  display: flex;
  justify-content: center;
  text-align: center;
  margin: 25px;
  font-size: 120%;
}


</style>
