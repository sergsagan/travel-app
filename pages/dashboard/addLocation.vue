<script setup lang="ts">
import type { FetchError } from 'ofetch';
import type { ZodType } from 'zod';

import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';

import FormField from '~/components/app/formField.vue';
import { InsertLocation } from '~/lib/db/schema';
import { CENTER_EUROPE } from "~/lib/constants";
import { formatNumber } from "~/utils/formatNumber";

const router = useRouter();
const mapStore = useMapStore();
const submitError = ref('');
const loading = ref(false);
const submitted = ref(false);

const csrfToken = ref<string | undefined>(undefined);

onMounted(async () => {
  const { token } = await $fetch('/api/csrf');
  csrfToken.value = token;
});

const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
  validationSchema: toTypedSchema(InsertLocation as unknown as ZodType),
});

const onSubmit = handleSubmit(async (values) => {
  try {
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
      setErrors(error.data?.data);
    }
    submitError.value = error.data?.statusMessage || error.statusMessage || 'An unexpected error occurred';
  }
  loading.value = false;
});

effect(() => {
  if (mapStore.newPoint) {
    setFieldValue('long', mapStore.newPoint.long);
    setFieldValue('lat', mapStore.newPoint.lat);
  }
})

onMounted(() => {
  mapStore.newPoint = {
    id: 1,
    name: 'New Point',
    description: '',
    long: CENTER_EUROPE[0],
    lat: CENTER_EUROPE[1],
  }
});

onBeforeRouteLeave(() => {
  if (!submitted.value && meta.value.dirty) {
    const confirm = window.confirm(
      'Are you sure you want to leave? All unsaved changes will be lost.',
    );
    if (!confirm) {
      return false;
    }
  }
  mapStore.newPoint = null;
  return true;
});
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
    <form class="flex flex-col gap-1" @submit.prevent="onSubmit">
      <FormField
        label="Location Name"
        name="name"
        type="text"
        :error="errors.name"
        :disabled="loading"
      />
      <FormField
        label="Description"
        name="description"
        type="textarea"
        :error="errors.description"
        :disabled="loading"
      />
      <p>Drag the <Icon name="tabler:map-pin" class="text-warning" /> marker to your desired location</p>
      <p class="text-xs text-gray-400">
        Current location: {{ formatNumber(controlledValues.lat) }}, {{ formatNumber(controlledValues.long) }}
      </p>
      <div class="flex justify-end gap-2">
        <button
          :disabled="loading"
          type="button"
          class="btn btn-outline min-w-27.5"
          @click="router.back()"
        >
          <Icon name="tabler:arrow-left" size="24" />Cansel
        </button>
        <button
          :disabled="loading"
          type="submit"
          class="btn btn-primary min-w-27.5"
        >
          Add
          <span v-if="loading" class="loading loading-spinner loading-sm" />
          <Icon
            v-else
            name="tabler:circle-plus-filled"
            size="24"
          />
        </button>
      </div>
    </form>
  </div>
</template>
