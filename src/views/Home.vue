<template>
  <div class="home_view">

    <h1 v-if="group">
      <img
        class="group_avatar"
        :src="group.properties.avatar_src"
        v-if="group.properties.avatar_src">
      <span>{{group.properties.name}}</span>
    </h1>
    <h1 v-else>行先</h1>

    <!-- status messages -->
    <div class="loader_container" v-if="loading">
      <Loader>Loading members...</Loader>
    </div>


    <div
      v-if="!loading && members.length > 0"
      class="employees_table">


      <User
        v-for="user in ordered_members"
        v-bind:user="user"
        v-bind:key="user.identity.low"/>

    </div>


    <div class="status_message" v-else>
      No member
    </div>



    <!-- overlay to show connection problems -->
    <!--<DisconnectionWarning/>-->

  </div>
</template>

<script>

import User from '@/components/User.vue'
//import DisconnectionWarning from '@/components/DisconnectionWarning.vue'
import Loader from '@moreillon/vue_loader'

export default {
  name: 'Home',
  components: {
    User,
    Loader,
    //DisconnectionWarning
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

    /*
    // The user might have passed the desired node id via query
    if(this.$route.query.node_id) {
      console.log("Node ID present in query")
      this.$store.commit("set_node_id", this.$route.query.node_id)
    }
    else {
      console.log('Node ID NOT present in query')
    }

    // Check if JWT present in query
    console.log("Checking if JWT present in query")
    if(this.$route.query.jwt){
      console.log('JWT present in query')
      this.$cookies.set('jwt', this.$route.query.jwt)
    }
    else {
      console.log("JWT is NOT present in query")
    }

    // If not logged in, move to login page
    // MIGHT NOT BE NEEDED HERE

    if(!this.$store.state.user) {
      console.log("User is not logged in, redirecting to login page")
      this.$router.push('/login')
    }


    // get employees
    // MIGHT NOT BE CONNECTED YET!!
    //this.$socket.client.emit('get_employees_belonging_to_node',this.$store.state.node_id);
    */

  },
  sockets: {

    members_of_group(received_member_records) {

      this.loading = false

      received_member_records.forEach((received_member_record) => {

        // index is not great
        let received_member = received_member_record._fields[0]

        let found_existing_member = this.members.find((existing_member) => {
          return existing_member.identity.low === received_member.identity.low
        })

        if(found_existing_member) {
          found_existing_member.properties = received_member.properties
        }
        else this.members.push(received_member)

      })

    },
    connect() {
      console.log('[WS] connected')
      this.get_members_of_group()
    },
  },
  methods: {
    get_group_info(){
      let group_id = this.$route.query.group_id
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

      let group_id = this.$route.query.group_id
      this.$socket.client.emit('get_members_of_group',{group_id: group_id})
    }

  },
  computed: {
    ordered_members() {
      return this.members.sort((a, b) => {
        return a.properties.employee_number - b.properties.employee_number;
      });
    }
  },

}
</script>

<style scoped>

.group_name_container {
  text-align: center;
  cursor: pointer;
  margin: 20px;

}
.group_name {
  font-size: 6vmin;
}



.employees_table {

  margin-left: 25px;
  margin-right: 25px;
  margin-bottom: 25px;

  /* IE fallback behavior */
  display: flex;
  flex-wrap: wrap;

  /* Normal behavior */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70vmin,1fr));
  grid-column-gap: 20px;
}

.status_message {
  display: flex;
  justify-content: center;
  text-align: center;
  margin: 25px;
  font-size: 120%;
}

h1 {
  text-align: center;
}

.group_avatar {
  width: 1em;
  height: 1em;
  object-fit: contain;
}

</style>
