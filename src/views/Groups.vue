<template>
  <div class="group_selection">
    <h1>Groups</h1>

    <div
      class="group"
      v-for="group in groups"
      :key="group.identity.low"
      @click="select_group(group.identity.low)" >
      {{group.properties.name}}

    </div>



  </div>

</template>

<script>

export default {
  name: 'Groups',
  components: {

  },
  data(){
    return {
      groups: [],
    }
  },
  mounted(){
    this.get_groups()
  },
  methods: {
    get_groups() {
      //let url = `${process.env.VUE_APP_GROUP_MANAGER_API_URL}/members/self/groups`
      let url = `${process.env.VUE_APP_WHEREABOUTS_API_URL}/members/self/groups`
      this.axios.get(url)
      .then( (response) => {
        this.groups = []
        response.data.forEach((record) => {
          let group = record._fields[record._fieldLookup.group]
          this.groups.push(group)
        })
      })
      .catch((error) => {
        console.log(error)
      })
    },
    select_group(group_id){
      this.$router.push({path: '/', query: { group_id: group_id } })


      /*

      // Save the node id in the store
      this.$store.commit("set_node_id", node_id);

      // Get the employees of the node
      this.$socket.client.emit('get_employees_belonging_to_node', this.$store.state.node_id);
      this.$store.commit('set_employees_loading', true);

      // Go back to main view
      this.$router.push({path: '/', query: { node_id: this.$store.state.node_id } })
      */

    },
  },
  /*
  sockets: {
    company_structure(data){
      console.log("Got company structure")
      this.company_structure = data;
    },
  }
  */
}
</script>

<style scoped>
.group {
  cursor: pointer;
}

.group:hover {
  color: #c00000;
}
</style>
