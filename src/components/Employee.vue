<template>
  <div class="employee">

    <!-- name cell -->
    <div
      class="name_cell"
      v-on:click="toggle_presence"
      v-bind:class="{present: presence, loading: employee.presence === 'loading'}">
      {{employee.name_kanji}}
    </div>

    <!-- location cell -->
    <div
      class="location_cell"
      v-if="!location_edit_mode"
      v-on:click="enable_location_edition()"
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

      <!-- controls -->
      <span class="mdi mdi-check icon_button" v-on:click="update_location()"></span>
      <span class="mdi mdi-close icon_button" v-on:click="location_edit_mode = false"></span>

    </form>

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

      // needs to be in data because v-model to input
      employee_copy: null,

      // premade location options
      premade_options: ["居室","帰宅","年休","出張"]
    }
  },
  methods: {

    enable_location_edition(){
      // Changing presence while editing location will override the location
      this.employee_copy = JSON.parse(JSON.stringify(this.employee))

      this.location_edit_mode = true;

      // Let the element actuall appear befoe trying to focus
      setTimeout(() => this.$refs.location_input.select(), 100)
    },

    update_location(){
      this.location_edit_mode = false;
      this.$socket.client.emit('update_back_end', this.employee_copy)

      // Loader
      this.employee.current_location = "updating..."


    },
    toggle_presence(){

      this.employee_copy = JSON.parse(JSON.stringify(this.employee))

      // Toggle state
      if(this.employee_copy.presence === "present") this.employee_copy.presence = "absent";
      else this.employee_copy.presence = "present"

      this.$socket.client.emit('update_back_end', this.employee_copy)

      this.employee.presence = "loading"
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

.name_cell, .location_cell, .location_edit_form  {
  margin: 5px;
  padding: 5px;
}

.name_cell, .location_cell{
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

  /*
  display: flex;
  align-items: center;
  */



}

.name_cell:not(.present){
  background-color: #c00000;
  color: white;
}

.name_cell.loading{
  background: rgb(255,255,255);
  background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 25%, rgba(192,0,0,1) 50%, rgba(255,255,255,1) 75%, rgba(255,255,255,1) 100%);
  background-size: 400% 400%;


  animation-name: movingGradient;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  color: black;

}

.location_cell, .location_edit_form{
  width: 65%;
  border-left: 1px solid #aaaaaa;
}

.location_cell {
  overflow: hidden;
  text-overflow: ellipsis; /* NOT WORKING */
}

.location_edit_form {
  display: flex;
  align-items: stretch;
}

.location_edit_form .icon_button{
  border-radius: 5px;
  border: 1px solid #444444;
  padding: 5px;
  display: flex;
  align-items: center;

  transition: background-color 0.1s;
}

.location_edit_form .icon_button:hover{
  background-color: #dddddd;
}

.location_edit_form > *{
  margin: 0 5px;
}

.location_edit_form input[type="search"]{
  border-radius: 5px;
  outline: none;
  border: 1px solid #444444;
  text-align: center;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
  min-width: 0;
}



@keyframes movingGradient {
  0%{background-position:100% 0%}
  100%{background-position:0% 0%}
}




</style>
