<script setup lang="ts">
import type { InsertLocation } from '~/lib/db/schema';

import { useLocationRouteParams } from '~/composables/useLocationRouteParams';

const locationStore = useLocationStore();
const { getCsrfHeaders } = useCsrfHeaders();
const { submitLocation } = useLocationSubmit(getCsrfHeaders);
const { slug, navigateToLocation } = useLocationRouteParams();

async function onSubmit(values: InsertLocation) {
  await submitLocation(`/api/locations/${slug.value}`, 'put', values);
}
</script>

<template>
  <LocationForm
    v-if="locationStore.currentLocationStatus !== 'pending'"
    :on-submit
    :on-submit-complete="navigateToLocation"
    :initial-values="locationStore.currentLocation"
    :zoom="12"
    submit-label="Update Location"
    submit-icon="tabler:map-pin-up"
  />
</template>
