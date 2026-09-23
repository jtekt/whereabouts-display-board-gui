<template>
  <v-card
    prepend-icon="mdi-information"
    :title="t('App title')"
    :subtitle="version"
  >
    <v-card-text>
      <div class="text-subtitle-2 mb-2">{{ t("Environment variables") }}</div>
      <v-table density="compact">
        <tbody>
          <tr v-for="envVar in envVars" :key="envVar.key">
            <td>{{ envVar.key }}</td>
            <td>{{ envVar.value }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import runtimeEnv from "@/runtimeEnv";

const { t } = useI18n();

const {
  VITE_WHEREABOUTS_API_URL,
  VITE_GROUP_MANAGER_API_URL,
  VITE_LOGIN_URL,
  VITE_AUTH_IDENTIFICATION_URL,
  VITE_OIDC_AUTHORITY,
  VITE_OIDC_CLIENT_ID,
} = runtimeEnv;

const version = import.meta.env.VITE_APP_VERSION || "dev";

const envVars = [
  { key: "VITE_WHEREABOUTS_API_URL", value: VITE_WHEREABOUTS_API_URL },
  { key: "VITE_GROUP_MANAGER_API_URL", value: VITE_GROUP_MANAGER_API_URL },
  { key: "VITE_LOGIN_URL", value: VITE_LOGIN_URL },
  { key: "VITE_AUTH_IDENTIFICATION_URL", value: VITE_AUTH_IDENTIFICATION_URL },
  { key: "VITE_OIDC_AUTHORITY", value: VITE_OIDC_AUTHORITY },
  { key: "VITE_OIDC_CLIENT_ID", value: VITE_OIDC_CLIENT_ID },
];
</script>
