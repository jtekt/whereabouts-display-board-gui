<template>
  <div class="employee">
    <!-- name cell -->
    <div class="name_cell" v-on:click="toggle_presence" v-bind:class="{present:presence}" >
      {{employee.name_kanji}}
    </div>
    <!-- End of name cell -->
    <!-- location cell -->
    <div class="location_cell">
      <div
        class="location"
        v-if="!location_edit_mode"
        v-on:click="location_editable()"
        v-html="employee.current_location">
      </div>

      <form v-else v-on:submit.prevent="update_location()">
        <input ref="location_input" type="search" v-model="employee_copy.current_location">
        <input type="submit" value="Update">
        <button type="button" v-on:click="location_edit_mode = false">Cancel</button>
      </form>

    </div>

    <!-- TOD: IMPLEMENT MODAL -->

   </div>
</template>

<script>
export default {
  name: 'Employee',
  props: {
    employee: Object,
  },
  data(){
    return{
      location_edit_mode: false,
      employee_copy: undefined,
    }
  },
  methods: {

    location_editable(){
      this.employee_copy = JSON.parse(JSON.stringify(this.employee))
      this.location_edit_mode = true;
      setTimeout(() => this.$refs.location_input.select(), 100)

    },

    update_location(){
      this.location_edit_mode = false;
      this.$socket.client.emit('update_back_end', this.employee_copy)

    },
    toggle_presence(){
      this.employee_copy = JSON.parse(JSON.stringify(this.employee))
      // Toggle state
      if(this.employee_copy.presence === "present") this.employee_copy.presence = "absent";
      else this.employee_copy.presence = "present"

      this.$socket.client.emit('update_back_end', this.employee_copy)
    },
  },
  computed: {
    presence(){
      if(this.employee.presence === "present") return true;
      else return false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.employee {
  /* IE fallback behavior */
  flex-grow: 1;
  flex-basis: 70vmin;

  /* flex for content */
  display: flex;

  /* visuals */
  border-radius: 5px;
  border: 1px solid #aaaaaa;

  margin: 5px;
  padding: 5px;

  font-size: 3.5vmin;
}

.name_cell, .location_cell {


  flex-basis: 0;
  text-align: center;

  cursor: pointer;

}

.name_cell {
  flex-grow: 1;
  user-select: none;
  border-radius: 5px;
  transition:
    background-color 0.5s,
    color 0.5s;
}



.location_cell {
  flex-grow: 2;
  border-left: 1px solid #aaaaaa;
  margin-left: 5px;
}

.location_cell > * {
  height: 100%;
}


.name_cell:not(.present){
  background-color: #ce0000;
  color: white;
}


</style>
