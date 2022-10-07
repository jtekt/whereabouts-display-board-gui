<template>
  <v-card max-width="40rem" class="mx-auto">

    <v-card-title>
      行先掲示板
    </v-card-title>

    <v-card-text>
      <p>
        A web-based display board to show the whereabouts of team members.
      </p>
      <p>
        Developped and maintained by <a href="https://maximemoreillon.com">Maxime MOREILLON</a>
      </p>

      <table>
        <tr>
          <th>Service</th>
          <th>Version</th>
          <th>URL</th>
        </tr>
        <tr v-for="(service, index) in services" :key="`service_${index}`">
          <td>{{service.name}}</td>
          <td>{{service.version}}</td>
          <td>{{service.url || 'Undefined'}}</td>
        </tr>
      </table>
    </v-card-text>

    




  </v-card>
</template>

<script>


import ArrowLeftIcon from 'vue-material-design-icons/ArrowLeft.vue'

import pjson from '@/../package.json'
export default {
  name: 'About',
  components: {
    ArrowLeftIcon
  },
  data () {
    return {

      services: [
        {
          name: 'Whereabouts GUI',
          url: window.location.origin,
          version: pjson.version
        },
        {
          name: 'Whereabouts API',
          url: process.env.VUE_APP_WHEREABOUTS_API_URL,
          version: null
        },
        
        {
          name: 'Group manager API',
          url: process.env.VUE_APP_GROUP_MANAGER_API_URL,
          version: null
        },
        {
          name: 'Login URL',
          url: process.env.VUE_APP_LOGIN_URL,
          version: 'N/A'
        },
        {
          name: 'Identification URL',
          url: process.env.VUE_APP_IDENTIFICATION_URL,
          version: 'N/A'
        },

      ],

    }
  },
  mounted () {
    this.get_services_version()
  },
  methods: {

    get_services_version () {
      this.services.forEach((service) => {
        if (service.version) return
        service.version = 'Connecting...'
        this.axios.get(service.url)
          .then(({ data }) => { service.version = data.version })
          .catch(() => { service.version = 'Unable to connect' })
      })
    }
  }


}
</script>

<style scoped>
table {
  width: 100%;
  margin-inline: auto;
  border-collapse: collapse;
  table-layout: fixed;

}

tr:not(:last-child) {
  border-bottom: 1px solid #dddddd;
}

td {
  padding: 0.25em 2em;
}

</style>
