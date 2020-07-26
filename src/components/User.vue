<template>
  <div class="employee">

    <!-- name cell -->
    <div
      class="name_cell"
      v-on:click="toggle_presence"
      v-bind:class="{
        present: user_is_present,
        loading: user.properties.presence === 'loading',
        editable: user_is_current_user,
        }">

        <span
          class="user_name">
          {{user.properties.name_kanji
          ||user.properties.display_name
          || 'Unnamed user'}}
        </span>



    </div>

    <div class="vertical_bar" />

    <!-- location cell -->
    <!-- If not in edit mode -->
    <div
      class="location_cell"
      :class="{editable: user_is_current_user}"
      v-if="!location_edit_mode"
      v-on:click="enable_location_edition()"
      v-html="user.properties.current_location">
    </div>

    <!-- If in edit mode -->
    <form
      v-else
      class="location_edit_form"
      v-on:submit.prevent="update_location()">

      <input
        ref="location_input"
        type="search"
        v-model="user_copy.properties.current_location"
        placeholder="行先"
        list="location_input_candidates">

      <!-- A few premade options -->
      <datalist
        style="display:none;"
        id="location_input_candidates">
        <option
          v-for="option in premade_options"
          v-bind:value="option"/>
      </datalist>

      <!-- controls -->
      <button
        type="button"
        class="green"
        @click="update_location()">
        <check-icon />
      </button>

      <button
        type="button"
        class="red"
        @click="location_edit_mode = false">
        <close-icon />
      </button>

    </form>

   </div>
</template>

<script>
import CheckIcon from 'vue-material-design-icons/Check.vue'
import CloseIcon from 'vue-material-design-icons/Close.vue'

export default {
  name: 'User',
  props: {
    user: Object,
  },
  components: {

    CheckIcon,
    CloseIcon,
  },
  data(){
    return{
      location_edit_mode: false,

      user_copy: null,

      // premade location options
      premade_options: [
        "居室",
        "帰宅",
        "年休",
        "出張"
      ]
    }
  },
  methods: {

    enable_location_edition(){

      if(!this.user_is_current_user) return
      this.location_edit_mode = true;

      // Changing presence while editing location will override the location
      this.user_copy = JSON.parse(JSON.stringify(this.user))

      // Let the element actuall appear befoe trying to focus
      setTimeout(() => this.$refs.location_input.select(), 100)
    },

    update_location(){

      if(!this.user_is_current_user) return


      this.location_edit_mode = false

      // Loader
      this.user.properties.current_location = "updating..."

      this.update_user()

    },
    toggle_presence(){

      if(!this.user_is_current_user) return


      this.user_copy = JSON.parse(JSON.stringify(this.user))

      // Toggle state
      if(this.user_is_present) this.user_copy.properties.presence = "absent"
      else this.user_copy.properties.presence = "present"

      // A bit dirty
      this.user.properties.presence = "loading"

      this.update_user()

    },
    update_user(){
      let user_id = this.user.identity.low
      let url = `${process.env.VUE_APP_WHEREABOUTS_API_URL}/users/${user_id}`
      let body = {
        presence: this.user_copy.properties.presence,
        current_location: this.user_copy.properties.current_location,
      }
      this.axios.patch(url,body)
      .then(() => {
      })
      .catch((error) => {console.log(error)})
    }
  },
  computed: {
    user_is_present(){
      return this.user.properties.presence === "present"
    },
    user_is_current_user(){
      return this.user.identity.low === this.$store.state.user.identity.low
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
  align-items: stretch;

  /* visuals */
  border-radius: 0.25em;
  border: 1px solid #aaaaaa;

  margin: 0.25em;
  padding: 0.25em;

  font-size: 3.5vmin;

}

.employee > *:not(:last-child) {
  margin-right: 0.25em;
}

.vertical_bar {
  border-left: 1px solid #aaaaaa;
}


.name_cell, .location_cell{
  padding: 0.25em;

  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}



.editable {
  cursor: pointer;
}

.name_cell {

  width: 35%;
  /* flex basis not working */
  flex-basis: 35%;
  flex-grow: 0;
  flex-shrink: 0;

  border-radius: 0.25em;

  user-select: none;
  transition:
    background-color 0.5s,
    color 0.5s;
}

.user_name {
  width: 100%;
  /* deal with names that are too long */
  /* does not work if using flex */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

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
  flex-grow: 1;
}

.location_edit_form {
  display: flex;
  align-items: stretch;
}

.location_edit_form > *:not(:last-child){
  margin-right: 0.25em;
}

.location_edit_form input[type="search"]{
  border-radius: 0.25em;
  outline: none;
  border: 1px solid #444444;
  text-align: center;

  font-size: 3.5vmin;

  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
  min-width: 0;
}

button {
  transition: color 0.25s, background-color 0.25s;
  border-radius: 0.25em;

}
.green {
  color: #00c000;
}

.red {
  color: #c00000;
}

.green:hover {
  color: white;
  background-color:  #00c000;
}

.red:hover {
  color: white;
  background-color:  #c00000;
}

@keyframes movingGradient {
  0%{background-position:100% 0%}
  100%{background-position:0% 0%}
}




</style>
