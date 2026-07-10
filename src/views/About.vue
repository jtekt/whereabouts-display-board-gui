<template>
  <v-card max-width="60rem" class="mx-auto">
    <v-card-title>行先掲示板</v-card-title>

    <v-card-text>
      <p>A web-based display board to show the whereabouts of team members.</p>
      <p>
        Developed and maintained by
        <a href="https://maximemoreillon.com">Maxime MOREILLON</a>
      </p>

      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Version</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(service, index) in services" :key="`service_${index}`">
            <td>{{ service.name }}</td>
            <td>{{ service.version }}</td>
            <td>{{ service.url || "Undefined" }}</td>
          </tr>
        </tbody>
      </table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import axios from "axios";
import pjson from "../../package.json";

interface Service {
  name: string;
  url: string | undefined;
  version: string | null;
}

const services = reactive<Service[]>([
  {
    name: "Whereabouts GUI",
    url: window.location.origin,
    version: pjson.version,
  },
  {
    name: "Whereabouts API",
    url: import.meta.env.VITE_WHEREABOUTS_API_URL,
    version: null,
  },
  {
    name: "Group manager API",
    url: import.meta.env.VITE_GROUP_MANAGER_API_URL,
    version: null,
  },
  {
    name: "Login URL",
    url: import.meta.env.VITE_LOGIN_URL,
    version: "N/A",
  },
  {
    name: "Identification URL",
    url: import.meta.env.VITE_AUTH_IDENTIFICATION_URL,
    version: "N/A",
  },
]);

async function getServicesVersion() {
  for (const service of services) {
    if (service.version) continue;
    service.version = "Connecting...";
    try {
      const { data } = await axios.get(service.url!);
      service.version = data.version ?? "Unknown";
    } catch {
      service.version = "Unable to connect";
    }
  }
}

onMounted(() => {
  getServicesVersion();
});
</script>

<style scoped>
table {
  width: 100%;
  margin-inline: auto;
  border-collapse: collapse;
  table-layout: fixed;
}

tr:not(:last-child) {
  border-bottom: 1px solid #dddddd;
}

td {
  padding: 0.25em 2em;
}
</style>
