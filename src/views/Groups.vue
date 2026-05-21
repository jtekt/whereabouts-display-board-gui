<template>
  <v-card max-width="40rem" class="mx-auto">
    <v-card-title>{{ $t("Groups") }}</v-card-title>

    <v-card-text>
      <GroupPicker
        class="group-picker"
        :groupManagerApiUrl="GROUP_MANAGER_API_URL"
        :group-manager-front-url="EMPLOYEE_MANAGER_FRONT_URL"
        :accessToken="session?.accessToken"
        @selection="selectGroup"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { GroupPicker } from "@moreillon/group-manager-vue-picker";
import { useAuth } from "@jtekt/vuetify-auth";

const router = useRouter();
const route = useRoute();
const { session } = useAuth();

const GROUP_MANAGER_API_URL = import.meta.env.VITE_GROUP_MANAGER_API_URL;
const EMPLOYEE_MANAGER_FRONT_URL = import.meta.env
  .VITE_EMPLOYEE_MANAGER_FRONT_URL;

interface Group {
  _id: string;
  [key: string]: unknown;
}

function selectGroup(group: Group) {
  const groupId = group._id;
  localStorage.setItem("group_id", groupId);
  router.push({ name: "whereabouts", params: { group_id: groupId } });
}

onMounted(() => {
  if (route.path === "/") {
    const groupId = localStorage.getItem("group_id");
    if (groupId)
      router.push({ name: "whereabouts", params: { group_id: groupId } });
  }
});
</script>

<style scoped>
.group-picker {
  max-height: 70vh;
  text-align: left;
}
</style>
