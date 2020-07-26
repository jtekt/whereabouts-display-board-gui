<template>
  <div class="group_selection">
    <h1>Groups</h1>

    <template v-if="!loading && groups.length > 0">
      <div
        class="group"
        v-for="group in groups"
        :key="group.identity.low"
        @click="select_group(group.identity.low)" >

        <!--
        <img
          class="group_avatar"
          v-if="group.properties.avatar_src"
          :src="group.properties.avatar_src">

        <img
          class="group_avatar"
          src="@/assets/account-multiple.png"
          v-else>
        -->

        <span class="group_name">
          {{group.properties.name}}
        </span>

      </div>
    </template>

    <!-- If the member is not part of any group -->
    <div
      class=""
      v-if="!loading && groups.length === 0">
      No groups
    </div>

    <!-- Loader -->
    <div
      v-if="loading"
      class="loader_container">
      <Loader>Loading groups...</Loader>
    </div>



  </div>
</template>

<script>
import AccountMultipleIcon from 'vue-material-design-icons/AccountMultiple.vue'

export default {
  name: 'Groups',
  components: {
    AccountMultipleIcon,
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
    select_group(group_id){
      this.$router.push({
        name: 'whereabouts',
        params: {
          group_id: group_id
        }
      })
    },
  },
}
</script>

<style scoped>

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
