<script setup lang="ts">
import LocationBaseForm from "~/components/locationBaseForm.vue";
import type { InsertLocation } from "~/lib/db/schema";

const { getCsrfHeaders } = useCsrfHeaders();
const { submitLocation } = useLocationSubmit(getCsrfHeaders);

async function onSubmit(values: InsertLocation) {
  await submitLocation('/api/locations', 'post', values);
}
function onSubmitComplete() {
  navigateTo('/dashboard');
}
</script>

<template>
  <div class="container max-w-md mx-auto p-4">
    <div class="my-4">
      <h2 class="text-2xl">
        Add Location
      </h2>
      <p class="text-sm">
        A location is a place you have traveled or will travel to. It can be a city, country, state or point of interest. You can add specific times you visited this location after adding it.
      </p>
    </div>
    <LocationForm :onSubmit :onSubmitComplete submitLabel="Add Location" submitIcon="tabler:circle-plus-filled" />
  </div>
</template>
