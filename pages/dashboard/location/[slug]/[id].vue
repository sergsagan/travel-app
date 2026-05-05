<script setup lang="ts">
import { toDateTimeLocal } from "~/utils/date";

const route = useRoute();
const locationsStore = useLocationStore();
const {
  currentLocationLog: locationLog,
  currentLocationLogStatus: status,
  currentLocationLogError: error
} = storeToRefs(locationsStore);

const loading = computed(() => status.value === 'pending');
const errorMessage = computed(() => error.value?.statusMessage);

onBeforeRouteUpdate((to) => {
  if (to.name === "dashboard-location-slug-id") {
    locationsStore.refreshCurrentLocationLog();
  }
});
</script>

<template>
  <div class="page-content-top">
    <div v-if="loading">
      <div class="loading" />
    </div>
    <div v-if="errorMessage && !loading" class="alert alert-error">
      <h2 class="text-xl">
        {{ errorMessage }}
      </h2>
    </div>
    <div v-if="route.name === 'dashboard-location-slug-id' && locationLog && !loading">
      <p class="text-small italic text-gray-500">
        <span v-if="locationLog.startedAt !== locationLog.endedAt">
          {{ toDateTimeLocal(locationLog.startedAt) }} / {{ toDateTimeLocal(locationLog.endedAt) }}
        </span>
        <span v-else>
          {{ toDateTimeLocal(locationLog.startedAt) }}
        </span>
      </p>
      <h2 class="text-xl">
        {{ locationLog.name }}
      </h2>
      <p class="text-sm">{{ locationLog.description }}</p>
    </div>
    <div v-else>
      <NuxtPage />
    </div>
  </div>
</template>
