<template>
  <v-btn icon @click="toggleTheme">
    <v-icon>mdi-theme-light-dark</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();

onMounted(() => {
  const saved = localStorage.getItem("theme");
  if (saved) theme.change(saved);
});

function toggleTheme() {
  theme.toggle();
  localStorage.setItem("theme", theme.global.name.value);
}
</script>
