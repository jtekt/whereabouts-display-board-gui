<template>
  <div>
    <h1>行先掲示板</h1>
    <p>
      A web-based display board to show the whereabouts of team members.
    </p>
    <p>
      Developped and maintained by <a href="https://maximemoreillon.com">Maxime MOREILLON</a>
    </p>
    <p>
       Front end version: {{version}}
    </p>
    <p>
      Back-end version: {{back_end_version}}
    </p>
    <p>
      Desktop client manual: <a href="行先掲示板_desktop_client_manual.pdf.pdf">download</a>
    </p>




  </div>
</template>

<script>

// UI elements
import pjson from '@/../package.json'
export default {
  name: 'About',
  data () {
    return {
      application_count: null,
      back_end_version: null,
      version: pjson.version,

    }
  },
  mounted(){
    this.get_back_end_version()
  },
  methods: {

    get_back_end_version(){
      let url = `${process.env.VUE_APP_WHEREABOUTS_API_URL}/`
      this.axios.get(url)
      .then((response) => {
        this.back_end_version = response.data.version
      })
      .catch(error => console.log(error))
    }
  }

}
</script>

<style scoped>


</style>
