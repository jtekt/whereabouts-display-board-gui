<template>
  <AppTemplate
    :options="options"
    @user="get_user($event)">

  </AppTemplate>
  <!-- <div id="app">
    <AppTemplate
      :authenticate="true"
      applicationName="行先掲示板">
    </AppTemplate>

  </div> -->
</template>

<script>
//import AppTemplate from '@moreillon/vue_application_template_flex'
import AppTemplate from '@moreillon/vue_application_template'

import TableIcon from 'vue-material-design-icons/Table.vue'
import AccountMultipleIcon from 'vue-material-design-icons/AccountMultiple.vue'


export default {
  name: 'app',
  components: {
    AppTemplate,
    TableIcon,
    AccountMultipleIcon
  },
  data(){
    return {
      options: {
        authenticate: true,
        title: '行先掲示板',
        login_url: process.env.VUE_APP_LOGIN_URL || `${process.env.VUE_APP_AUTHENTICATION_API_URL}/login`,
        identification_url: process.env.VUE_APP_IDENTIFICATION_URL || `${process.env.VUE_APP_AUTHENTICATION_API_URL}/whoami`
      }
    }
  },
  methods: {
    get_user(user){
      this.$store.commit('set_current_user',user)
      const jwt = this.$cookies.get('jwt') || localStorage.jwt
      if(jwt) this.$socket.client.emit('authentication', {jwt})

    }
  }
}
</script>

<style>

main {
  text-align: center;
}


button {
  border: none;
  background-color: transparent;
  color: black;
  cursor: pointer;
  outline: none;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition: color 0.25s, border-color 0.25s;
}

button:hover{
  color: #c00000;
}

button:disabled {
  color: #dddddd;
  cursor: not-allowed;
}

button > *:not(:last-child) {
  margin-right: 0.25em;
}

button.bordered {
  border: 1px solid black;
  border-radius: 5px;
  padding: 0.25em 0.5em;
}

button.bordered:hover {
  border-color: #c00000;
}

button.bordered:disabled {
  border-color: #dddddd;
}

.spacer {
  flex-grow: 1;
}

.action_bar {
  margin-top: 0.5em;
  display: flex;
  font-size: 120%;
}

.action_bar a {
  color: CurrentColor;
  text-decoration: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  transition: color 0.25s;
}

.action_bar a:hover {
  color: #c00000;
}

.action_bar a > *:not(:last-child){
  margin-right: 0.5em;
}


</style>
