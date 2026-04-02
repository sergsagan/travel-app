<script setup lang="ts">
import type { FetchError } from 'ofetch';
import LocationForm from "~/components/locationForm.vue";
import type { InsertLocation } from "~/lib/db/schema";

const submitError = ref('');
const submitErrors = ref<Record<string, string>>({});
const loading = ref(false);
const submitted = ref(false);

const csrfToken = ref<string | undefined>(undefined);

onMounted(async () => {
  const { token } = await $fetch('/api/csrf');
  csrfToken.value = token;
});

async function onSubmit(values: InsertLocation) {
  try {
    submitError.value = '';
    submitErrors.value = {};
    loading.value = true;
    await $fetch('/api/locations', {
      method: 'post',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken.value
          ? { 'x-csrf-token': csrfToken.value }
          : {}),
      },
      body: JSON.stringify(values),
    });
    submitted.value = true;
    navigateTo('/dashboard');
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      submitErrors.value = error.data?.data;
    }
    submitError.value = getFetchErrorMessage(error);
  }
  loading.value = false;
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
    <div
      v-if="submitError"
      role="alert"
      class="alert alert-error"
    >
      <span>{{ submitError }}</span>
    </div>
    <LocationForm :submitted :loading :onSubmit :submitErrors />
  </div>
</template>
