<template>
  <v-card :loading="loading">
    <v-container v-if="group">
      <v-row align="center">
        <v-spacer />
        <v-col cols="auto">
          <v-img
            height="4em"
            width="4em"
            contain
            :src="group.avatar_src"
            v-if="group.avatar_src"
          />
          <v-icon size="4em" v-else> mdi-account-group </v-icon>
        </v-col>
        <v-col cols="auto" class="text-h3">
          {{ group.name }}
        </v-col>
        <v-spacer />
      </v-row>
    </v-container>

    <v-card-text v-if="!loading && members.length" class="employees_table">
      <User
        v-for="(user, index) in ordered_members"
        :user="user"
        :key="`user_${index}`"
      />
    </v-card-text>

    <v-card-text class="status_message" v-if="!loading && !members.length">
      No member
    </v-card-text>

    <!-- overlay to show connection problems -->
    <DisconnectionWarning :visible="!$store.state.connected" />
  </v-card>
</template>

<script>
import User from "@/components/User.vue";
import DisconnectionWarning from "@/components/DisconnectionWarning.vue";

const { VUE_APP_GROUP_MANAGER_API_URL } = process.env;

export default {
  name: "Whereabouts",
  components: {
    User,
    DisconnectionWarning,
  },
  data() {
    return {
      loading: false, // used to distinguish between having no result or still loading

      group: null,

      members: [],
    };
  },

  mounted() {
    this.get_group_info();
    this.get_members_of_group();
  },
  sockets: {
    authenticated() {
      this.get_members_of_group();
    },
    error(message) {
      console.error(message);
      alert(message);
    },
    error_message(message) {
      console.error(message);
      alert(message);
    },
    members_of_group(received_members) {
      this.loading = false; // does not seem to do anything

      received_members.forEach((received_member) => {
        const found_index = this.members.findIndex(
          ({ _id }) => _id === received_member._id
        );

        // If user exists, update
        if (found_index > -1)
          this.$set(this.members, found_index, received_member);
        // else add user
        else this.members.push(received_member);
      });
    },
  },
  methods: {
    get_group_info() {
      const url = `${VUE_APP_GROUP_MANAGER_API_URL}/v3/groups/${this.group_id}`;
      this.axios
        .get(url)
        .then(({ data }) => {
          this.group = data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    get_members_of_group() {
      // Set loader
      this.loading = true;

      // Delete members
      this.members = [];

      this.$socket.client.emit("get_members_of_group", {
        group_id: this.group_id,
      });
    },
  },
  computed: {
    group_id() {
      return this.$route.params.group_id;
    },
    ordered_members() {
      return this.members.sort((a, b) => a.employee_number - b.employee_number);
    },
  },
};
</script>

<style scoped>
.employees_table {
  margin: 0.5em;

  /* IE fallback behavior */
  display: flex;
  flex-wrap: wrap;

  /* Normal behavior */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70vmin, 1fr));
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
  color: #c00000;
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
