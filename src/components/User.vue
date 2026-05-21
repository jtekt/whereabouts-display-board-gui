<template>
  <div class="employee" :class="{ self: userIsCurrentUser }">
    <!-- name cell -->
    <div
      class="name_cell"
      @click="toggleAvailability"
      :class="{
        party: user.whereabouts.availability === 'party',
        available: userIsAvailable,
        loading: user.whereabouts.availability === 'loading',
        editable: userCanEdit,
      }"
    >
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

    <!-- location cell — view mode -->
    <div
      class="location_cell"
      :class="{ editable: userCanEdit }"
      v-if="!locationEditMode"
      @click="enableLocationEdition"
      v-html="user.whereabouts.message"
    />

    <!-- location cell — edit mode -->
    <form v-else class="location_edit_form" @submit.prevent="updateLocation">
      <input
        ref="locationInputRef"
        type="text"
        v-model="userCopy!.whereabouts.message"
        placeholder="行先"
      />

      <div class="premade_options_wrapper">
        <div
          class="premade_option"
          v-for="option in premadeOptions"
          :key="option"
          @click="premadeOptionSelect(option)"
        >
          {{ option }}
        </div>
      </div>

      <v-btn
        icon
        @click="updateLocation"
        type="submit"
        color="success"
        size="small"
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
      <v-btn icon @click="locationEditMode = false" color="error" size="small">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </form>

    <div
      v-if="user.whereabouts.last_update && !locationEditMode"
      class="last_update_time"
    >
      {{ formatDate(user.whereabouts.last_update) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import axios from "axios";
import { useAuth } from "@jtekt/vuetify-auth";

interface Whereabouts {
  availability: string;
  message: string;
  last_update?: string;
}

interface UserData {
  _id: string;
  name_kanji?: string;
  display_name?: string;
  username?: string;
  employee_number?: number;
  whereabouts: Whereabouts;
}

const props = defineProps<{
  user: UserData;
}>();

const { session } = useAuth();

const locationEditMode = ref(false);
const userCopy = ref<UserData | null>(null);
const locationInputRef = ref<HTMLInputElement | null>(null);

const premadeOptions = ["居室", "帰宅", "年休", "出張", "在宅", "出社"];

const userId = computed(() => props.user._id);

const userIsAvailable = computed(() =>
  ["available", "present"].includes(props.user.whereabouts.availability),
);

const userIsCurrentUser = computed(() => {
  const user = session.value?.user.profile;
  const currentUserId = (user as Record<string, unknown>)?._id as
    | string
    | undefined;
  return !!currentUserId && currentUserId === userId.value;
});

const userIsAdmin = computed(() => {
  const user = session.value?.user.profile;
  return !!(user as Record<string, unknown>)?.isAdmin;
});

const userCanEdit = computed(
  () => userIsCurrentUser.value || userIsAdmin.value,
);

function enableLocationEdition() {
  if (!userCanEdit.value) return;
  locationEditMode.value = true;
  userCopy.value = JSON.parse(JSON.stringify(props.user));
  nextTick(() => locationInputRef.value?.select());
}

function updateLocation() {
  if (!userCanEdit.value || !userCopy.value) return;
  if (!userCopy.value.whereabouts.message) {
    userCopy.value.whereabouts.message = " ";
  }
  locationEditMode.value = false;
  props.user.whereabouts.message = "updating...";
  updateUser();
}

function toggleAvailability() {
  if (!userCanEdit.value) return;
  userCopy.value = JSON.parse(JSON.stringify(props.user));
  userCopy.value!.whereabouts.availability = userIsAvailable.value
    ? "unavailable"
    : "available";
  props.user.whereabouts.availability = "loading";
  updateUser();
}

function updateUser() {
  const body = {
    availability: userCopy.value!.whereabouts.availability,
    message: userCopy.value!.whereabouts.message,
  };
  axios.patch(`/users/${userId.value}`, body).catch((error) => {
    alert("Error while updating user");
    if (error.response) console.error(error.response.data);
    else console.error(error);
  });
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function premadeOptionSelect(option: string) {
  if (!userCopy.value) userCopy.value = JSON.parse(JSON.stringify(props.user));
  userCopy.value!.whereabouts.message = option;
  updateLocation();
}
</script>

<style scoped>
.employee {
  position: relative;
  flex-grow: 1;
  flex-basis: 70vmin;
  display: flex;
  align-items: stretch;
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
  flex-grow: 0;
  flex-shrink: 0;
  border-radius: 0.25em;
  user-select: none;
  transition:
    background-color 0.5s,
    color 0.5s;
}

.user_name {
  width: 100%;
  line-height: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.name_cell:not(.available) {
  background-color: #c00000;
  color: white;
}

.name_cell.loading {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 25%,
    rgba(192, 0, 0, 1) 50%,
    rgba(255, 255, 255, 1) 75%,
    rgba(255, 255, 255, 1) 100%
  );
  background-size: 400% 400%;
  animation: movingGradient 1s linear infinite;
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
  box-shadow:
    0 3px 6px rgba(0, 0, 0, 0.16),
    0 3px 6px rgba(0, 0, 0, 0.23);
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
  animation: party 2s linear infinite;
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
