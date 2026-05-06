<script setup lang="ts">
import type { InsertLocationLog } from '~/lib/db/schema';

import { useLocationRouteParams } from '~/composables/useLocationRouteParams';

const locationStore = useLocationStore();
const {
  currentLocationLog: locationLog,
} = storeToRefs(locationStore);

const { getCsrfHeaders } = useCsrfHeaders();
const { submitLocation } = useLocationSubmit(getCsrfHeaders);

const { slug, id, navigateToLocationLog } = useLocationRouteParams();

async function onSubmit(values: InsertLocationLog) {
  await submitLocation(`/api/locations/${slug.value}/${id.value}`, 'put', values);
}
</script>

<template>
  <LocationLogsForm
    v-if="locationLog"
    submit-label="Update Location Log"
    submit-icon="tabler:map-pin-up"
    :on-submit="onSubmit"
    :on-submit-complete="navigateToLocationLog"
    :initial-values="locationLog"
  />
</template>
