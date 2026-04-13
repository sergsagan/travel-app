<script setup lang="ts">
import type { FetchError } from 'ofetch';
import LocationForm from "~/components/locationForm.vue";
import type { InsertLocation } from "~/lib/db/schema";

const locationStore = useLocationStore();
const csrfToken = ref<string | undefined>(undefined);
const route = useRoute();
const slug = computed(() => route.params.slug as string);

onMounted(async () => {
  const { token } = await $fetch('/api/csrf');
  csrfToken.value = token;
});


async function onSubmit(values: InsertLocation) {
  try {
    await $fetch(`/api/locations/${slug.value}`, {
      method: 'put',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken.value
            ? {'x-csrf-token': csrfToken.value}
            : {}),
      },
      body: JSON.stringify(values),
    });

  }
  catch (e) {
    const error = e as FetchError;
    console.error(error);
  }
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
