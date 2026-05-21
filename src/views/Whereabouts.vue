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

interface WhereaboutsUpdate {
  user_id: string;
  availability: string;
  message: string;
  last_update: string;
}

const route = useRoute();
const { getSocket } = useSocket();

const GROUP_MANAGER_API_URL = import.meta.env.VITE_GROUP_MANAGER_API_URL;

const socket = getSocket();
const loading = ref(false);
const group = ref<{ name: string; avatar_src?: string } | null>(null);
const members = ref<UserData[]>([]);

const pendingUpdates: Record<string, WhereaboutsUpdate> = {};
const batchSize = 30;
const startIndex = ref(0);
const hasMore = ref(true);

const groupId = computed(() => route.params.group_id as string);

const orderedMembers = computed(() =>
  [...members.value].sort(
    (a, b) =>
      ((a.employee_number as number) ?? 0) -
      ((b.employee_number as number) ?? 0),
  ),
);

// Fetch static group info
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

async function loadNextBatch() {
  if (!hasMore.value) return;

  loading.value = true;

  const url = `${GROUP_MANAGER_API_URL}/v3/groups/${groupId.value}/members`;

  const response = await axios.get(url, {
    params: {
      batch_size: batchSize,
      start_index: startIndex.value,
    },
  });

  const items = response.data?.items ?? [];

  if (!items.length) {
    hasMore.value = false;
    loading.value = false;
    return;
  }

  const ids = items.map((u: any) => u._id);

  // Whereabouts fetch
  const wbResponse = await axios.get("/users/whereabouts", {
    params: { ids: ids.join(",") },
  });

  const wbMap = wbResponse.data ?? {};

  const batchMembers = items.map((member: any) => {
    const id = String(member._id);

    const defaultWB = {
      user_id: id,
      availability: "absent",
      message: "unknown",
      last_update: undefined,
    };

    // Merge pending update if exists
    const appliedWb = pendingUpdates[id] ?? wbMap[id] ?? defaultWB;

    return {
      ...member,
      whereabouts: appliedWb,
    };
  });

  members.value.push(...batchMembers);

  // Remove pending updates for these ids
  ids.forEach((id: string) => delete pendingUpdates[id]);

  startIndex.value += batchSize;
  loading.value = false;
}

// Join WS groups & load first batch
function onAuthenticated() {
  socket.emit("join_groups", { group_ids: [groupId.value] });
  loadNextBatch();
}

function onJoinedGroups(groups: string[]) {
  console.log("Joined groups:", groups);
}

function onWhereaboutsUpdated(update: WhereaboutsUpdate) {
  const idx = members.value.findIndex((m) => m._id === update.user_id);

  if (idx !== -1) {
    members.value[idx].whereabouts = update;
    return;
  }

  // Not yet loaded. Stash for later
  pendingUpdates[update.user_id] = update;
}

function onError(message: string) {
  console.error(message);
  alert(message);
}

onMounted(() => {
  getGroupInfo();
  socket.on("authenticated", onAuthenticated);
  socket.on("joined_groups", onJoinedGroups);
  socket.on("whereabouts_updated", onWhereaboutsUpdated);
  socket.on("error_message", onError);

  if (socket.connected) {
    onAuthenticated();
  }
});

onUnmounted(() => {
  const socket = getSocket();
  socket.off("authenticated", onAuthenticated);
  socket.off("joined_groups", onJoinedGroups);
  socket.off("whereabouts_updated", onWhereaboutsUpdated);
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
