<template>
  <div class="debug">
    <h1>Debugging</h1>
    <p>Cookies domain: {{cookies_domain}}</p>



  </div>
</template>

<script>


export default {
  name: 'Debug',
  components: {

  },
  data(){
    return {
      cookies_domain: process.env.VUE_APP_COOKIE_DOMAIN

    }
  },
}
</script>

<style scoped>

</style>
