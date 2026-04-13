<script setup lang="ts">
import LocationForm from "~/components/locationForm.vue";
import type { InsertLocation } from "~/lib/db/schema";

const locationStore = useLocationStore();
const { getCsrfHeaders } = useCsrfHeaders();
const { submitLocation } = useLocationSubmit(getCsrfHeaders);
const route = useRoute();
const slug = computed(() => route.params.slug as string);


async function onSubmit(values: InsertLocation) {
  await submitLocation(`/api/locations/${slug.value}`, 'put', values);
}
function onSubmitComplete() {
  navigateTo({
    name: 'dashboard-location-slug',
    params: { slug: slug.value },
  });
}
</script>

<template>
  <LocationForm
      v-if="locationStore.currentLocationStatus !== 'pending'"
      :onSubmit
      :onSubmitComplete
      :initialValues="locationStore.currentLocation"
      submitLabel="Update Location"
      submitIcon="tabler:map-pin-up"
  />
</template>
