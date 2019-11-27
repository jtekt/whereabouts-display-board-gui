<template>
  <div
    class="disconnection_warning"
    v-bind:class="{open: warning_visible}">

    <div class="device_container">
      <span class="mdi mdi-laptop"></span>
      <div class="device_label">Client</div>
    </div>

    <!-- Connection between client and AWS -->
    <div class="connection">
      <hr>
      <span class="mdi mdi-loading" v-if="!$store.state.connection_status.external_connected"></span>
      <hr>
    </div>


    <div class="device_container">
      <span class="mdi mdi-server"></span>
      <div class="device_label">AWS</div>
    </div>

    <div class="connection">
      <hr>
      <span class="mdi mdi-close" v-if="!$store.state.connection_status.internal_connected"></span>
      <hr>
    </div>

    <div class="device_container">
      <span class="mdi mdi-server"></span>
      <div class="device_label">JTEKT</div>
    </div>



  </div>
</template>

<script>
export default {
  name: 'DisconnectionWarning',

  data(){
    return {
      enabled: false,
    }

  },
  mounted() {
    setTimeout(() => {this.enabled = true}, 1000)
  },

  computed: {
    warning_visible(){
      return this.enabled && (!this.$store.state.connection_status.external_connected || !this.$store.state.connection_status.internal_connected)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.disconnection_warning{
  /* poisitioning and sizing of background*/
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;

  /* positioning of content */
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #444444; /* fallback for ie */
  background-color: #444444cc;

  /* values which change when opening the modal */
  /* here are the defaults */
  visibility: hidden;
  opacity: 0;

  transition:
    visibility 0.5s,
    opacity 0.5s;
}

.disconnection_warning.open{
  visibility: visible;
  opacity: 1;

  /* Delay when OPENING */
  transition-delay: 0s;
}

.disconnection_warning{
  /* delay when CLOSING */
  transition-delay: 0.25s;
}


.device_container {
  text-align: center;
  color: white;
  font-size: 4vmin;

}

.device_label{
  text-align: center;
}

.device_container > span {
  font-size: 15vmin;
  margin: 2vmin;

}

.connection {
  width: 20vmin;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.connection hr{
  border: 0.5vmin solid white;
  width: 100%;
  margin: 0;
}

.connection span {
  margin: 10px;
  font-size: 10vmin;
  width: 7vmin;
  height: 7vmin;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mdi-close {
  color: #c00000;
  animation-name: blinking;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

.mdi-loading {
  color: transparent;

  border-radius: 100%;

  border: 0.5vmin solid white;
  border-color: white transparent white transparent;

  animation-name: loader_rotation;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes loader_rotation {
  0% {transform: rotate(0deg);}
  100% {transform: rotate(360deg);}
}

@keyframes blinking {
  0% {opacity: 0;}
  100% {opacity: 1;}
}




</style>
