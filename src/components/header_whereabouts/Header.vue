<template>
  <header>

    <!-- stuff on the right side -->
    <div class="signature">
      <img class="logo" src="@/assets/logo/thick/logo.svg" alt="">
      <div class="software_name">{{softwareName}}</div>
    </div>

    <!-- stuff on the left side -->
    <div class="buttons_wrapper">
      <span v-if="user" class="mdi mdi-account-group button_icon" v-on:click="$emit('open_node_selector')"></span>
      <span v-if="user" class="mdi mdi-logout button_icon" v-on:click="$emit('logout')"></span>
    </div>





  </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    softwareName: {
      type: String,
    },
    user: {
      type: Object,
    },
  },
  data(){
    return {
      user_info_visible: false,
    }
  },
  methods: {

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
header{
  position: relative;

  background-color: #333333;
  color: white;


  display: flex;
  justify-content: space-between;

  border-bottom: 2px solid #c00000;

  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);

  padding: 10px;
}

header > * {
  display: flex;
  align-items: center;
}


.signature {

}

.signature > * {
  margin-right: 5px;
}

.logo {
  height: 25px;

  animation-name: logo_rotation;
  animation-duration: 60s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}


.software_name{
  font-size: 22px;
}

.login_info{
  text-align: center;
}

.buttons_wrapper {

}

.button_icon{
  margin-left: 15px;
  color: white;
  cursor: pointer;
  font-size: 25px;
}

.button_icon:hover{
  color: #bbbbbb;
}

@keyframes logo_rotation {
  0% {transform: rotate(0deg);}
  100% {transform: rotate(360deg);}
}
</style>
