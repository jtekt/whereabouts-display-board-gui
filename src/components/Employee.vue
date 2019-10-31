<template>
  <div class="employee">
    <!-- name cell -->
    <div class="name_cell" v-on:click="toggle_presence" v-bind:class="{present:presence}" >
      {{employee.name_kanji}}
    </div>
    <!-- End of name cell -->
    <!-- location cell -->
    <div
      class="location_cell"
      v-if="!location_edit_mode"
      v-on:click="location_editable()"
      v-html="employee.current_location">
    </div>

    <form
      v-else
      class="location_cell location_edit_form"
      v-on:submit.prevent="update_location()">
      <input
        ref="location_input"
        type="search"
        v-model="employee_copy.current_location"
        placeholder="行先"
        list="location_input_candidates">
      <!-- A few premade options -->
      <datalist style="display:none;" id="location_input_candidates">
        <option v-for="option in premade_options" v-bind:value="option"/>
      </datalist>
      <input type="submit" value="Update">
      <button type="button" v-on:click="location_edit_mode = false">Cancel</button>
    </form>



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
      premade_options: [
        "居室",
        "帰宅",
        "年休",
        "出張",
      ]
    }
  },
  methods: {

    location_editable(){
      this.employee_copy = JSON.parse(JSON.stringify(this.employee))
      this.location_edit_mode = true;

      // Let the element actuall appear befoe trying to focus
      setTimeout(() => this.$refs.location_input.select(), 100)
    },

    update_location(){
      this.location_edit_mode = false;
      this.$socket.client.emit('update_back_end', this.employee_copy)

      // Loader
      // TODO: make a better loading loader
      this.employee.current_location = "updating..."

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
* {
  box-sizing: border-box;
}
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

  font-size: 3.5vmin;
}

.name_cell, .location_cell  {

  margin: 5px;
  padding: 5px;


  text-align: center;
  cursor: pointer;

}

.name_cell {
  width: 35%;

  border-radius: 5px;

  user-select: none;
  transition:
    background-color 0.5s,
    color 0.5s;

  /* deal with names that are too long */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.name_cell:not(.present){
  background-color: #ce0000;
  color: white;
}



.location_cell {
  width: 65%;

  border-left: 1px solid #aaaaaa;


  overflow: hidden;
  text-overflow: ellipsis; /* NOT WORKING */
}


.location_edit_form {
  display: flex;
  align-items: stretch;
}

.location_edit_form > *{
  margin: 0 5px;
}

.location_edit_form input[type="search"]{
  flex-grow: 1;
}





</style>
