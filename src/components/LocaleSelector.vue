<template>
  <v-select
    prepend-icon="mdi-translate"
    :items="locales"
    v-model="locale"
    item-title="text"
    item-value="value"
    density="compact"
    hide-details
    @update:model-value="saveLocale"
  />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const locales = [
  { text: "English", value: "en" },
  { text: "日本語", value: "ja" },
];

function saveLocale() {
  localStorage.setItem("locale", locale.value);
}

onMounted(() => {
  const saved = localStorage.getItem("locale");
  if (saved) locale.value = saved;
});
</script>
