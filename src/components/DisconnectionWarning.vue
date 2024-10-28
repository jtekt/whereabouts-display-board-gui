<template>
  <div class="disconnection_warning" v-bind:class="{ open: warning_visible }">
    <Loader>Connecting...</Loader>
  </div>
</template>

<script>
export default {
  name: "DisconnectionWarning",
  props: {
    visible: Boolean,
  },
  data() {
    return {
      enabled: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.enabled = true;
    }, 1000);
  },

  computed: {
    warning_visible() {
      return this.enabled && this.visible;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.disconnection_warning {
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

  color: white;
  font-size: 6vmin;

  /* values which change when opening the modal */
  /* here are the defaults */
  visibility: hidden;
  opacity: 0;

  transition: visibility 0.5s, opacity 0.5s;
}

.disconnection_warning.open {
  visibility: visible;
  opacity: 1;

  /* Delay when OPENING */
  transition-delay: 0s;
}

.disconnection_warning {
  /* delay when CLOSING */
  transition-delay: 0.25s;
}

@keyframes blinking {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
