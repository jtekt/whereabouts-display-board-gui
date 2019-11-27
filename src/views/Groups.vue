<template>
  <div class="groups_view">

    <div class="corporate_structure_container" v-if="company_structure.length > 0">

      <CorporateStructureNode
        v-on:select_node="select_node($event)"
        v-for="division in company_structure"
        v-bind:node_data="division"/>

    </div>

    <!-- Loading corporate structure -->
    <div v-else class="corporate_structure_loader">
      <div class="loader"/>
    </div>

    <!-- overlay to show connection problems -->
    <DisconnectionWarning/>

  </div>

</template>

<script>
import CorporateStructureNode from '@/components/CorporateStructureNode.vue'
import DisconnectionWarning from '@/components/DisconnectionWarning.vue'

export default {
  name: 'Groups',
  components: {
    CorporateStructureNode,
    DisconnectionWarning
  },
  data(){
    return {
      company_structure: [],
    }
  },
  mounted(){
    console.log("Groups view mounted")
    this.$socket.client.emit('get_company_structure', {})
  },
  methods: {
    select_node(node_id){

      // Save the node id in the store
      this.$store.commit("set_node_id", node_id);

      // Go back to main view
      this.$router.push("/");

    },
  },
  sockets: {
    company_structure(data){
      console.log("Got company structure")
      this.company_structure = data;
    },
  }
}
</script>

<style scoped>
.corporate_structure_container{
  margin-top: 10px;
  max-height: 75vh;
  overflow-y: auto;
}


.corporate_structure_loader {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
