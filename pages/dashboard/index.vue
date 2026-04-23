<script setup lang="ts">
import {createMapPointFromLocation} from "~/utils/mapPoints";
import { computed } from 'vue';

const locationsStore = useLocationStore();
const { locations, locationsStatus: status } = storeToRefs(locationsStore);

await locationsStore.refreshLocations()

const mappedLocations = computed(() => {
  return (locations.value || []).map((loc: any) => createMapPointFromLocation(loc));
});

</script>

<template>
  <div class="page-content-top">
    <h2 class="text-2xl ml-4">
      Locations
    </h2>
    <div v-if="status === 'pending'">
      <span class="loading loading-spinner loading-xl" />
    </div>
    <div v-else-if="locations && locations.length > 0" class="location-list">
      <LocationCard
        v-for="location in mappedLocations"
        :key="location.id"
        :map-point="location"
      />
    </div>
    <div v-else class="flex flex-col gap-2 mt-4">
      <p>Add location to get started</p>
      <NuxtLink to="/dashboard/addLocation" class="btn btn-primary w-40">
        Add Location
        <Icon name="tabler:circle-plus-filled" size="24" />
      </NuxtLink>
    </div>
  </div>
</template>
