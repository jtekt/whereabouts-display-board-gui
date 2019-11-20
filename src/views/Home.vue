<template>
  <div class="home">
  </div>
</template>

<script>
import Employee from '@/components/Employee.vue'

export default {
  name: 'home',
  components: {

  },
  data(){
    return {
      employees: [],

      
    }
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
  margin-top: 10px;
  height: 75vh;
  overflow-y: auto;
}


.corporate_structure_loader {
  text-align: center;
  margin-top: 10px;
  height: 75vh;
}

.modal_window_outer{
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
}

.modal_title {
  font-size: 4vmin;
  text-align: center;
}

</style>
