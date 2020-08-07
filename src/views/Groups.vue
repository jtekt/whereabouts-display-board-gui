<template>
  <div class="group_selection">
    <h1>Groups</h1>

    <GroupPicker
      class="group_picker"
      @selection="select_group($event)"/>

    <!--
    <template v-if="!loading && groups.length > 0">

      <template v-if="official_groups.length > 0">
        <h2>Company groups</h2>
        <div
          class="group"
          v-for="group in official_groups"
          :key="group.identity.low"
          @click="select_group(group.identity.low)" >

          <span class="group_name">
            {{group.properties.name}}
          </span>

        </div>
      </template>

      <template v-if="non_official_groups.length > 0">
        <h2>User created groups</h2>

        <div
          class="group"
          v-for="group in non_official_groups"
          :key="group.identity.low"
          @click="select_group(group.identity.low)" >

          <span class="group_name">
            {{group.properties.name}}
          </span>

        </div>
      </template>





    </template>


    <div
      class=""
      v-if="!loading && groups.length === 0">
      No groups
    </div>

    <div
      v-if="loading"
      class="loader_container">
      <Loader>Loading groups...</Loader>
    </div>
    -->





  </div>
</template>

<script>
import AccountMultipleIcon from 'vue-material-design-icons/AccountMultiple.vue'
import GroupPicker from '@moreillon/vue_group_picker'

export default {
  name: 'Groups',
  components: {
    AccountMultipleIcon,
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
    this.get_groups()
  },
  methods: {
    get_groups() {
      this.loading = true
      //let url = `${process.env.VUE_APP_GROUP_MANAGER_API_URL}/members/self/groups`
      let url = `${process.env.VUE_APP_WHEREABOUTS_API_URL}/members/self/groups`
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
          group_id: group.identity.low
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
