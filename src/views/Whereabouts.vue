<template>
  <v-card :loading="loading">
    <v-container v-if="group">
      <v-row align="center">
        <v-spacer />
        <v-col cols="auto">
          <v-img
            v-if="group.avatar_src"
            height="4em"
            width="4em"
            contain
            :src="group.avatar_src"
          />
          <v-icon v-else size="4em">mdi-account-group</v-icon>
        </v-col>
        <v-col cols="auto" class="text-h3">
          {{ group.name }}
        </v-col>
        <v-spacer />
      </v-row>
    </v-container>

    <v-card-text v-if="!loading && members.length" class="employees_table">
      <User
        v-for="(user, index) in orderedMembers"
        :user="user"
        :key="`user_${index}`"
      />
    </v-card-text>

    <v-card-text class="status_message" v-if="!loading && !members.length">
      No member
    </v-card-text>

    <!-- DisconnectionWarning reads isConnected internally from useSocket() -->
    <DisconnectionWarning />
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import User from "@/components/User.vue";
import DisconnectionWarning from "@/components/DisconnectionWarning.vue";
import { useSocket } from "@/composables/useSocket";

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

const route = useRoute();
const { getSocket } = useSocket();

const GROUP_MANAGER_API_URL = import.meta.env.VITE_GROUP_MANAGER_API_URL;

const loading = ref(false);
const group = ref<{ name: string; avatar_src?: string } | null>(null);
const members = ref<UserData[]>([]);

const groupId = computed(() => route.params.group_id as string);

const orderedMembers = computed(() =>
  [...members.value].sort(
    (a, b) =>
      ((a.employee_number as number) ?? 0) -
      ((b.employee_number as number) ?? 0),
  ),
);

async function getGroupInfo() {
  try {
    const { data } = await axios.get(
      `${GROUP_MANAGER_API_URL}/v3/groups/${groupId.value}`,
    );
    group.value = data;
  } catch (error) {
    console.error(error);
  }
}

function getMembersOfGroup() {
  loading.value = true;
  members.value = [];
  getSocket().emit("get_members_of_group", { group_id: groupId.value });
}

function onAuthenticated() {
  getMembersOfGroup();
}

function onMembersOfGroup(receivedMembers: UserData[]) {
  loading.value = false;
  receivedMembers.forEach((receivedMember) => {
    const foundIndex = members.value.findIndex(
      (m) => m._id === receivedMember._id,
    );
    if (foundIndex > -1) {
      members.value[foundIndex] = receivedMember;
    } else {
      members.value.push(receivedMember);
    }
  });
}

function onError(message: string) {
  console.error(message);
  alert(message);
}

onMounted(() => {
  getGroupInfo();
  getMembersOfGroup();

  const socket = getSocket();
  socket.on("authenticated", onAuthenticated);
  socket.on("members_of_group", onMembersOfGroup);
  socket.on("error", onError);
  socket.on("error_message", onError);
});

onUnmounted(() => {
  const socket = getSocket();
  socket.off("authenticated", onAuthenticated);
  socket.off("members_of_group", onMembersOfGroup);
  socket.off("error", onError);
  socket.off("error_message", onError);
});
</script>

<style scoped>
.employees_table {
  margin: 0.5em;
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
</style>
