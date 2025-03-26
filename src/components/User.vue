<template>
  <div class="employee" :class="{ self: user_is_current_user }">
    <!-- name cell -->
    <div
      class="name_cell"
      @click="toggle_availability()"
      :class="{
        party: user.whereabouts.availability === 'party',
        available: user_is_available,
        loading: user.whereabouts.availability === 'loading',
        editable: user_can_edit,
      }"
    >
      <!-- Inner span so as to not use flex -->
      <span class="user_name">
        {{
          user.name_kanji ||
          user.display_name ||
          user.username ||
          "Unnamed user"
        }}
      </span>
    </div>

    <div class="vertical_bar" />

    <!-- location cell -->
    <!-- If not in edit mode -->
    <div
      class="location_cell"
      :class="{ editable: user_can_edit }"
      v-if="!location_edit_mode"
      v-on:click="enable_location_edition()"
      v-html="user.whereabouts.message"
    ></div>

    <!-- If in edit mode -->
    <form v-else class="location_edit_form" @submit.prevent="update_location()">
      <input
        ref="location_input"
        type="text"
        v-model="user_copy.whereabouts.message"
        placeholder="行先"
      />

      <!-- A few premade options -->
      <div class="premade_options_wrapper">
        <div
          class="premade_option"
          v-for="option in premade_options"
          v-bind:key="option"
          @click="premade_option_select(option)"
        >
          {{ option }}
        </div>
      </div>

      <!-- controls -->
      <v-btn icon @click="update_location()" type="submit" color="success">
        <v-icon>mdi-check</v-icon>
      </v-btn>
      <!-- <button type="button" class="green_button" @click="update_location()">
        <check-icon />
      </button> -->

      <v-btn icon @click="location_edit_mode = false" color="error">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </form>

    <div
      v-if="user.whereabouts.last_update && !location_edit_mode"
      class="last_update_time"
    >
      {{ format_date(user.whereabouts.last_update) }}
    </div>
  </div>
</template>

<script>
export default {
  name: "User",
  props: {
    user: Object,
  },

  data() {
    return {
      location_edit_mode: false,

      user_copy: null,

      // premade location options
      // Use ENV
      premade_options: ["居室", "帰宅", "年休", "出張", "在宅", "出社"],
    };
  },
  methods: {
    enable_location_edition() {
      // Only allow users to edit themselves
      if (!this.user_can_edit) return;

      this.location_edit_mode = true;

      // Changing availability while editing location will override the location
      this.user_copy = JSON.parse(JSON.stringify(this.user));

      // Let the element actuall appear befoe trying to focus
      setTimeout(() => this.$refs.location_input.select(), 100);
    },

    update_location() {
      // Only allow usersto edit themselves
      if (!this.user_can_edit) return;

      // Setting current location as a space if nothing provided
      if (!this.user_copy.whereabouts.message) {
        this.user_copy.whereabouts.message = " ";
      }

      this.location_edit_mode = false;

      // Loader
      this.user.whereabouts.message = "updating...";

      this.update_user();
    },
    toggle_availability() {
      // Only allow usersto edit themselves
      if (!this.user_can_edit) return;

      // Create a copy of the user so as not to edit the actual one
      this.user_copy = JSON.parse(JSON.stringify(this.user));

      // Toggle state
      if (this.user_is_available)
        this.user_copy.whereabouts.availability = "unavailable";
      else this.user_copy.whereabouts.availability = "available";

      // A bit dirty
      this.user.whereabouts.availability = "loading";

      this.update_user();
    },
    update_user() {
      const url = `${process.env.VUE_APP_WHEREABOUTS_API_URL}/users/${this.user_id}`;
      const body = {
        availability: this.user_copy.whereabouts.availability,
        message: this.user_copy.whereabouts.message,
      };
      this.axios
        .patch(url, body)
        .then(() => {})
        .catch((error) => {
          alert(`Error while updating user`);
          if (error.response) console.error(error.response.data);
          else console.error(error);
        });
    },
    format_date(date) {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(date).toLocaleString("ja-JP", options);
    },
    premade_option_select(option) {
      this.user_copy.whereabouts.message = option;
      this.update_location();
    },
  },
  computed: {
    user_id() {
      return this.user._id;
    },
    user_is_available() {
      const avilable_words = ["available", "present"];

      return avilable_words.includes(this.user.whereabouts.availability);
    },
    user_is_current_user() {
      const current_user_id =
        this.$store.state.user._id || this.$store.state.user.properties._id;
      return current_user_id === this.user_id;
    },
    user_is_admin() {
      const current_user = this.$store.state.user;
      if (!current_user.properties) return current_user.isAdmin;
      else return current_user.properties.isAdmin;
    },
    user_can_edit() {
      return this.user_is_current_user || this.user_is_admin;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.employee {
  position: relative;
  /* IE fallback behavior */
  flex-grow: 1;
  flex-basis: 70vmin;

  /* flex for content */
  display: flex;
  align-items: stretch;

  /* visuals */
  border-radius: 0.25em;
  border: 1px solid #aaaaaa;

  margin: 0.25em;
  padding: 0.25em;

  font-size: 3vmin;
}

.self {
  border-width: 3px;
}

.employee > *:not(:last-child) {
  margin-right: 0.25em;
}

.vertical_bar {
  border-left: 1px solid #aaaaaa;
}

.name_cell,
.location_cell {
  padding: 0.5em;

  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.location_cell {
  overflow-x: hidden;
  white-space: nowrap;
}

.editable {
  cursor: pointer;
}

.name_cell {
  width: 35%;
  /* flex basis weird on Firefox */
  flex-grow: 0;
  flex-shrink: 0;

  border-radius: 0.25em;

  user-select: none;
  transition: background-color 0.5s, color 0.5s;
}

.user_name {
  width: 100%;
  line-height: 100%;

  /* deal with names that are too long */
  /* does not work if using flex */
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
}

.name_cell:not(.available) {
  background-color: #c00000;
  color: white;
}

.name_cell.loading {
  background: rgb(255, 255, 255);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 25%,
    rgba(192, 0, 0, 1) 50%,
    rgba(255, 255, 255, 1) 75%,
    rgba(255, 255, 255, 1) 100%
  );
  background-size: 400% 400%;

  animation-name: movingGradient;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  color: black;
}

.location_cell,
.location_edit_form {
  flex-grow: 1;
}

.location_edit_form {
  position: relative;

  display: flex;
  align-items: center;
}

.location_edit_form > *:not(:last-child) {
  margin-right: 0.25em;
}

.location_edit_form input[type="search"],
.location_edit_form input[type="text"] {
  border-radius: 0.25em;
  outline: none;
  border: 1px solid #444444;
  text-align: center;

  padding: 0.25em;

  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
  min-width: 0;
  width: 0;
}

button {
  transition: color 0.25s, background-color 0.25s;
  border-radius: 0.25em;
  padding: 0 0.5em;
  font-size: 100%;
}
.green_button {
  color: #00c000;
}

.red_button {
  color: #c00000;
}

.green_button:hover {
  color: white;
  background-color: #00c000;
}

.red_button:hover {
  color: white;
  background-color: #c00000;
}

@keyframes movingGradient {
  0% {
    background-position: 100% 0%;
  }
  100% {
    background-position: 0% 0%;
  }
}

.last_update_time {
  color: #aaaaaa;
  position: absolute;
  bottom: 0.25em;
  right: 0.5em;
  font-size: 50%;
}

.premade_options_wrapper {
  background-color: white;
  position: absolute;
  top: calc(100% + 0.5em);
  left: 0%;
  width: calc(100% - 4.5em);
  z-index: 1;

  border-radius: 0.25em;
  border: 1px solid #aaaaaa;

  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.premade_option {
  padding: 0.5em;
  cursor: pointer;
}

.premade_option:not(:last-child) {
  border-bottom: 1px solid #dddddd;
}

.premade_option:hover {
  background-color: #eeeeee;
}

.name_cell.party {
  color: green;
  animation-name: party;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes party {
  0% {
    background-color: green;
    color: yellow;
  }
  25% {
    background-color: red;
    color: blue;
  }
  50% {
    background-color: yellow;
    color: green;
  }
  75% {
    background-color: blue;
    color: red;
  }
  100% {
    background-color: green;
    color: yellow;
  }
}
</style>
