<script setup lang="ts">
const route = useRoute();
const locationsStore = useLocationStore();
const { currentLocation: location, currentLocationStatus: status, currentLocationError: error } = storeToRefs(locationsStore);

onMounted(() => {
  locationsStore.refreshCurrentLocation();
})

onBeforeRouteUpdate((to) => {
  if (to.name === 'dashboard-location-slug') {
    locationsStore.refreshCurrentLocation();
  }
})
</script>

<template>
  <div class="p-4 min-h-64">
    <div v-if="status === 'pending'">
      <div class="loading" />
    </div>
    <div v-if="error && status !== 'pending'" class="alert alert-error">
      <h2 class="text-xl">
        {{ error.statusMessage}}
      </h2>
    </div>
    <div v-if="route.name === 'dashboard-location-slug' && location && status !== 'pending'">
      <h2 class="text-xl">{{ location.name }}</h2>
      <p class="text-sm">{{ location.description }}</p>
      <div v-if="(location.locationLogs?.length ?? 0) === 0" class="mt-4">
        <p class="text-sm italic">
          Add a location log to get started
        </p>
        <button class="btn btn-primary mt-2">
          Add Location Log
          <Icon name="tabler:map-pin-plus" size="24" />
        </button>
      </div>
    </div>
    <div v-if="route.name !== 'dashboard-location-slug'" class="mt-4">
      <NuxtPage />
    </div>
  </div>
</template>
