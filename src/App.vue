<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="#000">
      <v-app-bar-nav-icon v-if="session" @click="drawer = !drawer" />
      <v-img src="/logo.png" height="30" max-width="30" contain class="ml-2" />
      <v-app-bar-title> 行先掲示板 </v-app-bar-title>
      <template #append>
        <LocaleSelector />
        <ThemeToggler />

        <v-btn v-if="session" icon="mdi-logout" @click="logout" />
      </template>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-if="session" v-model="drawer">
      <v-list density="compact" nav>
        <v-list-item
          v-for="item in nav"
          :key="item.to.name"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          exact
        />
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useAuth } from "@jtekt/vuetify-auth";
import { useSocket } from "@/composables/useSocket";
import LocaleSelector from "@/components/LocaleSelector.vue";
import ThemeToggler from "@/components/ThemeToggler.vue";
import { useAxiosAuth } from "@/composables/useAxiosAuth";

useAxiosAuth();
const { t } = useI18n();
const { session, logout } = useAuth();
const { authenticate, connect } = useSocket();

const drawer = ref(false);

const nav = computed(() => [
  {
    title: t("Groups"),
    to: { name: "groups" },
    icon: "mdi-account-multiple",
  },
  {
    title: t("About"),
    to: { name: "about" },
    icon: "mdi-information-outline",
  },
]);

onMounted(() => {
  connect(import.meta.env.VITE_WHEREABOUTS_API_URL);
});

// Authenticate socket whenever a session becomes available
watch(
  () => session.value?.accessToken,
  (token) => {
    if (token) {
      authenticate(token);
    }
  },
);
</script>
