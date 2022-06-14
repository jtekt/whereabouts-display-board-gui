<template>
  <v-card class="mx-auto" max-width="40rem">
    <v-card-title primary-title>
      {{ $t('Client configuration')}}
    </v-card-title>
    <v-card-text>
      <v-row align="baseline">
        <v-col>
          <v-text-field readonly v-model="token" label="Token" />
        </v-col>
        <v-col cols="auto">
          <v-btn v-if="copy_supported" icon @click="copy_to_clipboard(token)">
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row align="baseline">
        <v-col>
          <v-text-field readonly v-model="api_url" label="API URL" />
        </v-col>
        <v-col v-if="copy_supported" cols="auto">
          <v-btn icon @click="copy_to_clipboard(api_url)">
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>

    <v-snackbar v-model="snackbar.show">
      Value copied to clipboard
    </v-snackbar>





  </v-card>
</template>

<script>



export default {
  name: 'About',

  data() {
    return {
      api_url: `${process.env.VUE_APP_WHEREABOUTS_API_URL}/update`,
      token: this.$cookies.get('jwt'),
      snackbar: {
        show: false,
        text: ''
      },
      copy_supported: false,
    }
  },
  mounted() {
    if (navigator.clipboard) this.copy_supported = true
  },
  methods: {
    async copy_to_clipboard(value) {
      await navigator.clipboard.writeText(value)
      this.snackbar.show = true
    }

  },
  computed: {

  }


}
</script>

<style scoped>
</style>
