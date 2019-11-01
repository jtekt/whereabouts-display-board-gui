<template>
  <div class="top_bar">

    <div class="signature">

      <img src="@/assets/logo/thick/logo.svg" alt="">
      <div class="software_info">
        <div class="">{{softwareName}}</div>
        <div class="">Maxime MOREILLON</div>
      </div>

    </div>

    <div class="" v-if="user">
      Logged in as {{user.name_kanji}}
      <button type="button" v-on:click="$emit('logout')">Logout</button>
    </div>

    <!-- status messages -->
    <div class="" v-else> Not logged in </div>

  </div>
</template>

<script>
export default {
  name: 'TopBar',
  props: {
    softwareName: String,
    user: Object,
  },
  data(){
    return {}
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top_bar{
  background-color: #444444;
  color: white;
  padding: 10px;

  display: flex;
  justify-content: space-between;
}

.signature{
  display: flex;
}
.signature img {
  height: 40px;

  animation-name: logo_rotation;
  animation-duration: 60s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.software_info {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

@keyframes logo_rotation {
  0% {transform: rotate(0deg);}
  100% {transform: rotate(360deg);}
}
</style>
