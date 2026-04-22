<script setup lang="ts">
import type { InsertLocationLog } from "~/lib/db/schema";
import { CENTER_EUROPE } from "~/lib/constants";
const route = useRoute();
const { currentLocation } = useLocationStore();

const { getCsrfHeaders } = useCsrfHeaders();
const { submitLocation } = useLocationSubmit(getCsrfHeaders);

async function onSubmit(values: InsertLocationLog) {
  await submitLocation(`/api/locations/${route.params.slug}/add`, 'post', values);
}

function submitComplete() {
    navigateTo({
      name: 'dashboard-location-slug',
      params: { slug: route.params.slug as string },
    });
}
</script>

<template>
  <LocationLogsForm
      submitLabel="Add Location Log"
      submitIcon="tabler:map-pin-plus"
      :onSubmit="onSubmit"
      :onSubmitComplete="submitComplete"
      :initialValues="{
        name: '',
        description: '',
        lat: currentLocation?.lat || CENTER_EUROPE[1],
        long: currentLocation?.long || CENTER_EUROPE[0],
        startedAt: Date.now() - (24 * 60 * 60 * 1000),
        endedAt: Date.now(),
      }"
  />
</template>
