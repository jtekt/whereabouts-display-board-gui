<template>
  <div class="home_view">

    <router-link
      class="group_name_wrapper"
      :to="{ name: 'groups'}">
      <h1 v-if="group">
        <img
          class="group_avatar"
          :src="group.properties.avatar_src"
          v-if="group.properties.avatar_src">
        <span>{{group.properties.name}}</span>
      </h1>
      <h1 v-else>行先</h1>
      <p>(Click to change)</p>
    </router-link>



    <!-- status messages -->
    <div
      class="loader_container"
      v-if="loading">
      <Loader/>
    </div>


    <div
      v-if="!loading && members.length > 0"
      class="employees_table">


      <User
        v-for="user in ordered_members"
        v-bind:user="user"
        v-bind:key="user.identity.low"/>

    </div>


    <div
      class="status_message"
      v-if="!loading && members.length === 0">
      No member
    </div>



    <!-- overlay to show connection problems -->
    <DisconnectionWarning :visible="!$store.state.connected"/>

  </div>
</template>

<script>

import User from '@/components/User.vue'
import DisconnectionWarning from '@/components/DisconnectionWarning.vue'

export default {
  name: 'Home',
  components: {
    User,
    DisconnectionWarning
  },
  data(){
    return {
      // Employees could actually be managed here
      loading: false, // used to distinguish between having no result or still loading

      group: null,

      members: [],

    }
  },

  mounted(){
    this.get_group_info()
    this.get_members_of_group()
  },
  sockets: {

    authenticated(){
      this.get_members_of_group()
    },
    error(message){
      console.error(message)
    },

    members_of_group(received_member_records) {

      this.loading = false

      received_member_records.forEach((received_member_record) => {

        let received_member = received_member_record._fields[received_member_record._fieldLookup.user]
          || received_member_record._fields[received_member_record._fieldLookup.employee]

        let found_existing_member = this.members.find((existing_member) => {
          return existing_member.identity.low === received_member.identity.low
        })

        if(found_existing_member) {
          found_existing_member.properties = received_member.properties
        }
        else this.members.push(received_member)

      })

    },
  },
  methods: {
    get_group_info(){
      let group_id = this.$route.params.group_id
      let url = `${process.env.VUE_APP_GROUP_MANAGER_API_URL}/groups/${group_id}`
      this.axios.get(url)
      .then( (response) => {
        this.group = response.data
      })
      .catch((error) => {
        console.log(error)
      })
    },
    get_members_of_group(){

      // Set loader
      this.loading = true

      // Delete members
      this.members = []

      let group_id = this.$route.params.group_id
      this.$socket.client.emit('get_members_of_group',{group_id: group_id})
    }

  },
  computed: {
    ordered_members() {
      return this.members.sort((a, b) => {
        return a.properties.employee_number - b.properties.employee_number
      })
    }
  },

}
</script>

<style scoped>





.employees_table {

  margin: 0.5em;

  /* IE fallback behavior */
  display: flex;
  flex-wrap: wrap;

  /* Normal behavior */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70vmin,1fr));
  grid-column-gap: 1em;
}

.status_message {
  display: flex;
  justify-content: center;
  text-align: center;
  margin: 1em;
  font-size: 120%;
}

.group_name_wrapper {
  text-align: center;
  text-decoration: none;
  color: CurrentColor;
  transition: color 0.25s;
}
.group_name_wrapper h1 {
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.group_name_wrapper p {
  margin-top: 0;
}

.group_name_wrapper:hover {
  color: #C00000;
}


.group_avatar {
  width: 1em;
  height: 1em;
  object-fit: contain;
  margin-right: 0.25em;
}

.loader_container {
  margin-top: 10vmin;
  font-size: 10vmin;
  text-align: center;
}

</style>
