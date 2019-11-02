<template>
  <div
    class="disconnection_warning"
    v-bind:class="{open: warning_visible}">

    <div class="device_container">
      <span class="mdi mdi-laptop"></span>
      <div class="device_label">Client</div>
    </div>

    <div class="connection">
      <hr>
      <span class="mdi mdi-close" v-bind:class="{visible: !this.connectionStatus.external_connected}"></span>
    </div>


    <div class="device_container">
      <span class="mdi mdi-server"></span>
      <div class="device_label">AWS</div>
    </div>

    <div class="connection">
      <hr>
      <span class="mdi mdi-close" v-bind:class="{visible: !this.connectionStatus.internal_connected}"></span>
    </div>

    <div class="device_container">
      <span class="mdi mdi-server"></span>
      <div class="device_label">Mike</div>
    </div>



  </div>
</template>

<script>
export default {
  name: 'DisconnectionWarning',
  props: {
    connectionStatus: Object
  },
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
      return this.enabled && (!this.connectionStatus.external_connected || !this.connectionStatus.internal_connected)
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
  background-color: #444444aa;

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
  margin: 5vmin;

}

.connection {
  width: 10vw;
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
  position: absolute;
  color: #c00000;
  font-size: 10vmin;
}

.connection span:not(.visible){
  visibility: hidden;
}








</style>
