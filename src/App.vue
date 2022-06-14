<template>
  <AppTemplate
    :options="options"
    @user="get_user($event)">

    <template v-slot:nav>
      <v-list
        dense
        nav >
        <v-list-item>
          <LocaleSelector />
        </v-list-item>
        <v-divider />
        <v-list-item
          v-for="(item, index) in nav"
          :key="`nav_item_${index}`"
          :to="item.to"
          exact>
          <v-list-item-icon>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>

  </AppTemplate>
</template>

<script>
import AppTemplate from '@moreillon/vue_application_template_vuetify'
import LocaleSelector from './components/LocaleSelector.vue'


export default {
  name: 'App',

  components: {
    AppTemplate,
    LocaleSelector
  },

  data: () => ({
    options: {
      title: "行先掲示板",
      authenticate: true,
      login_url: process.env.VUE_APP_LOGIN_URL || `${process.env.VUE_APP_AUTHENTICATION_API_URL}/login`,
      identification_url: process.env.VUE_APP_IDENTIFICATION_URL || `${process.env.VUE_APP_AUTHENTICATION_API_URL}/v2/whoami`,
    },
  }),

  methods: {
    get_user(user){
      this.$store.commit('set_current_user',user)
    },
  },
  computed: {
    nav(){
      return [
        {title: this.$t('Groups'), to: {name: 'groups'}, icon: 'mdi-account-multiple'},
        { title: this.$t('Client configuration'), to: { name: 'client_config' }, icon: 'mdi-cogs' },
        {title: this.$t('About'), to: {name: 'about'}, icon: 'mdi-information-outline'},
      ]
    }
  }
};
</script>