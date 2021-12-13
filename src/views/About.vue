<template>
  <div>

    <div class="action_bar">
      <router-link :to="{ name: 'groups'}">
        <ArrowLeftIcon />
        <span>Groups</span>
      </router-link>

      <div class="spacer"/>
    </div>

    <h1>行先掲示板</h1>
    <p>
      A web-based display board to show the whereabouts of team members.
    </p>
    <p>
      Developped and maintained by <a href="https://maximemoreillon.com">Maxime MOREILLON</a>
    </p>

    <p>
      Desktop client manual: <a href="行先掲示板_desktop_client_manual.pdf">download</a>
    </p>

    <h2>Services</h2>
    <table>
      <tr>
        <th>Service</th>
        <th>Version</th>
        <th>URL</th>
      </tr>
      <tr
        v-for="(service, index) in services"
        :key="`service_${index}`">
        <td>{{service.name}}</td>
        <td>{{service.version}}</td>
        <td>{{service.url}}</td>
      </tr>
    </table>




  </div>
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
          name: 'Authentication API',
          url: process.env.VUE_APP_AUTHENTICATION_API_URL,
          version: null
        },
        {
          name: 'Group manager API',
          url: process.env.VUE_APP_GROUP_MANAGER_API_URL,
          version: null
        },
        {
          name: 'Employee manager API',
          url: process.env.VUE_APP_EMPLOYEE_MANAGER_API_URL,
          version: null
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
  border-collapse: collapse;
  table-layout: fixed;

}

tr:not(:last-child) {
  border-bottom: 1px solid #dddddd;
}

th {
  text-align: left;
}
td {
  padding: 0.25em;
}

</style>
