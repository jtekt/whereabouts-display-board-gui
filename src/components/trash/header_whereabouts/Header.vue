<template>
  <header>

    <!-- stuff on the right side -->
    <img class="rotating_logo" src="@/assets/logo/thick/logo.svg" alt="">
    <div class="application_name">{{applicationName}}</div>

    <!-- stuff on the left side -->
    <span v-if="user" class="mdi mdi-account-group button aligned-right" v-on:click="$emit('open_node_selector')"></span>
    <span v-if="user" class="mdi mdi-logout button" v-on:click="$emit('logout')"></span>


  </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    applicationName: {
      type: String,
    },
    user: {
      type: Object,
    },
  },
  data(){
    return {}
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app header {
  grid-area: header;

  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);

  background-color: #444444;
  color: white;


  display: flex;
  align-items: stretch;
}

.application_name{
  font-size: 120%;
}

header > * {
  display: flex;
  align-items: center;

  margin: 10px;
  /* keep only one margin width between elements */
  margin-right: 0px;
}

header > *:last-child {
  margin-right: 10px;
}

.rotating_logo {
  width: 35px;
  height: 35px;
}

.aligned-right{
  margin-left: auto
}

.button {
  font-size: 180%;
  cursor: pointer;
}


.button:hover{
  color: #bbbbbb;
}

@keyframes logo_rotation {
  0% {transform: rotate(0deg);}
  100% {transform: rotate(360deg);}
}
</style>
