<template>
  <div class="home_view">

    <!-- Top bar for navigation -->
    <div class="action_bar">
      <router-link :to="{ name: 'groups'}">
        <ArrowLeftIcon />
        <span>Groups</span>
      </router-link>

      <div class="spacer"/>

      <router-link :to="{ name: 'about'}">
        <InformationOutlineIcon />
        <span>Info</span>
      </router-link>

    </div>

    <!-- Group name -->
    <router-link
      class="group_name_wrapper"
      :to="{ name: 'groups'}">

      <template v-if="group">

        <img
          class="group_avatar"
          :src="group.properties.avatar_src"
          v-if="group.properties.avatar_src">

        <h1 class="group_name">
          {{group.properties.name}}
        </h1>
      </template>


      <h1 v-else>行先</h1>

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

      <!-- Stringifying so as to deal with disableLossLessIntegers -->
      <User
        v-for="user in ordered_members"
        v-bind:user="user"
        v-bind:key="JSON.stringify(user.identity)"/>

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

import ArrowLeftIcon from 'vue-material-design-icons/ArrowLeft.vue'
import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline.vue'

export default {
  name: 'Home',
  components: {
    User,
    DisconnectionWarning,

    ArrowLeftIcon,
    InformationOutlineIcon,

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
      // I'm really pissed this never gfets called
      console.error(message)
    },
    members_of_group(received_member_records) {

      this.loading = false // does not seem to do anything

      received_member_records.forEach((received_member_record) => {

        const received_member = received_member_record._fields[received_member_record._fieldLookup.user]
          || received_member_record._fields[received_member_record._fieldLookup.employee]

        // Check if the view already contaisn a user with the same ID
        const found_index = this.members.findIndex((existing_member) => {
          const received_member_id = received_member.identity.low
            || received_member.identity

          const existing_member_id = existing_member.identity.low
            || existing_member.identity

          return  received_member_id === existing_member_id
        })

        // Update the member's whereabouts if existing already
        if(found_index > -1) this.$set(this.members,found_index,received_member)

        // else add user
        else this.members.push(received_member)

      })

    },
  },
  methods: {
    get_group_info(){
      const group_id = this.$route.params.group_id
      const url = `${process.env.VUE_APP_GROUP_MANAGER_API_URL}/groups/${group_id}`
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

      const group_id = this.$route.params.group_id
      this.$socket.client.emit('get_members_of_group', {group_id})
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
  margin: 1em;
  display: block;
  text-align: center;
  text-decoration: none;
  color: CurrentColor;
  transition: color 0.25s;
}



.group_name_wrapper:hover {
  color: #C00000;
}

.group_name_wrapper h1 {
  font-size: 5vmin;
  margin: 0;
}


.group_avatar {
  width: 12vmin;
  height: 12vmin;
  object-fit: contain;
}

.loader_container {
  margin-top: 10vmin;
  font-size: 10vmin;
  text-align: center;
}




</style>
