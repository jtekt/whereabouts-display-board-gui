<template>
  <div class="group_selection">

    <div class="action_bar">

      <div class="spacer"/>

      <router-link :to="{ name: 'about'}">
        <InformationOutlineIcon />
        <span>Info</span>
      </router-link>

    </div>

    <h1>Groups</h1>

    <GroupPicker
      class="group_picker"
      @selection="select_group($event)"/>

  </div>
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
  margin-left: auto;
  margin-right: auto;
  max-width: 30em;
  max-height: 500px;
  text-align: left;
}
.group {
  cursor: pointer;
  transition:
    color 0.25s,
    border-color 0.25s,
    background-color 0.25s;
  padding: 0.5em;
  margin: 0.5em 0;
  border: 1px solid #dddddd;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-left: auto;
  margin-right: auto;
  max-width: 400px;
}

.group:hover {
  color: #c00000;
  border-color: #c00000;
}

.loader_container {
  text-align: center;
  font-size: 150%;
}

.group_avatar {
  margin-right: 0.5em;
}

img.group_avatar{
  width: 1em;
  height: 1em;
  object-fit: contain;
}
</style>
