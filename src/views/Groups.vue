<template>
  <v-card
    max-width="40rem"
    class="mx-auto">

    <v-card-title>
      Groups
    </v-card-title>

    <v-card-text>
      <GroupPicker
        class="group_picker"
        @selection="select_group($event)"/>
    </v-card-text>
    

  </v-card>
</template>

<script>
import AccountMultipleIcon from 'vue-material-design-icons/AccountMultiple.vue'
import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline.vue'

import GroupPicker from '@moreillon/vue_group_picker'

export default {
  name: 'Groups',
  components: {
    AccountMultipleIcon,
    InformationOutlineIcon,
    GroupPicker,
  },
  data(){
    return {
      loading: false,
      error: null,
      groups: [],
    }
  },
  mounted(){
    //this.get_groups()
  },
  methods: {
    get_groups() {
      this.loading = true
      const url = `${process.env.VUE_APP_WHEREABOUTS_API_URL}/members/self/groups`
      this.axios.get(url)
      .then( (response) => {
        this.groups = []
        response.data.forEach((record) => {
          let group = record._fields[record._fieldLookup.group]
          this.groups.push(group)
        })
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {this.loading = false})
    },
    select_group(group){
      this.$router.push({
        name: 'whereabouts',
        params: {
          group_id: group._id || group.properties._id
        }
      })
    },
  },
  computed: {
    official_groups(){
      return this.groups.filter( group => {
        return group.properties.official
      })
    },
    non_official_groups(){
      return this.groups.filter( group => {
        return !group.properties.official
      })
    },
  }
}
</script>

<style scoped>
.group_picker {
  max-height: 70vh;
  text-align: left;
}

</style>
