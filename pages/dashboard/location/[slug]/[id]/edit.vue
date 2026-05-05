<script setup lang="ts">
import type { InsertLocationLog } from "~/lib/db/schema";

const route = useRoute();
const locationStore = useLocationStore();
const {
  currentLocationLog: locationLog,
} = storeToRefs(locationStore);

const { getCsrfHeaders } = useCsrfHeaders();
const { submitLocation } = useLocationSubmit(getCsrfHeaders);

const slug = computed(() => route.params.slug as string);
const id = computed(() => route.params.id as string);

async function onSubmit(values: InsertLocationLog) {
  await submitLocation(`/api/locations/${slug.value}/${id.value}`, 'put', values);
}
function submitComplete() {
  navigateTo({
    name: 'dashboard-location-slug-id',
    params: {
      slug: slug.value,
      id: id.value,
    },
  });
}
</script>

<template>
  <LocationLogsForm
      v-if="locationLog"
      submitLabel="Update Location Log"
      submitIcon="tabler:map-pin-up"
      :onSubmit="onSubmit"
      :onSubmitComplete="submitComplete"
      :initialValues="locationLog"
  />
</template>
