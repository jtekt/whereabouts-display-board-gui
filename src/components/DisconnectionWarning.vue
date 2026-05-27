<template>
  <v-overlay
    :model-value="warningVisible"
    class="align-center justify-center"
    persistent
    :z-index="100"
    style="background-color: rgba(68, 68, 68, 0.8)"
  >
    <div class="disconnection-content">
      <v-progress-circular indeterminate color="white" size="48" class="mr-4" />
      <span class="text-white text-h6">Connecting...</span>
    </div>
  </v-overlay>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useSocket } from "@/composables/useSocket";
const socketStore = useSocket();

// Delay showing the warning by 1 s to avoid flashing on fast connections
const enabled = ref(false);

onMounted(() => {
  setTimeout(() => {
    enabled.value = true;
  }, 1000);
});

const warningVisible = computed(
  () => enabled.value && !socketStore.isConnected.value,
);
</script>

<style scoped>
.disconnection-content {
  display: flex;
  align-items: center;
  font-size: 6vmin;
}
</style>
