<script setup lang="ts">
import type { InsertLocationLog } from '~/lib/db/schema';

import { useLocationRouteParams } from '~/composables/useLocationRouteParams';
import { CENTER_EUROPE } from '~/lib/constants';

const { currentLocation } = useLocationStore();
const { slug, navigateToLocation } = useLocationRouteParams();

const { getCsrfHeaders } = useCsrfHeaders();
const { submitLocation } = useLocationSubmit(getCsrfHeaders);

async function onSubmit(values: InsertLocationLog) {
  await submitLocation(`/api/locations/${slug.value}/add`, 'post', values);
}
</script>

<template>
  <LocationLogsForm
    submit-label="Add Location Log"
    submit-icon="tabler:map-pin-plus"
    :on-submit="onSubmit"
    :on-submit-complete="navigateToLocation"
    :initial-values="{
      name: '',
      description: '',
      lat: currentLocation?.lat || CENTER_EUROPE[1],
      long: currentLocation?.long || CENTER_EUROPE[0],
      startedAt: Date.now(),
      endedAt: Date.now(),
    }"
  />
</template>
