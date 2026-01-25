<script setup lang="ts">
import type { ZodType } from 'zod';

import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';

import FormField from '~/components/app/formField.vue';
import { InsertLocation } from '~/lib/db/schema';

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(InsertLocation as unknown as ZodType),
});

const onSubmit = handleSubmit((values) => {
  console.log(values);
});
</script>

<template>
  <div class="container max-w-md mx-auto">
    <div class="my-4">
      <h1 class="text-lg">
        Add Location
      </h1>
      <p class="text-sm">
        A location is a place you have traveled or will travel to. It can be a city, country, state or point of interest. You can add specific times you visited this location after adding it.
      </p>
    </div>
    <form class="flex flex-col gap-1" @submit.prevent="onSubmit">
      <FormField
        label="Location Name"
        name="name"
        type="text"
        :error="errors.name"
      />
      <FormField
        label="Description"
        name="description"
        type="textarea"
        :error="errors.description"
      />
      <FormField
        label="Latitude"
        name="lat"
        type="number"
        :error="errors.lat"
      />
      <FormField
        label="Longitude"
        name="long"
        type="number"
        :error="errors.long"
      />
      <div class="flex justify-end gap-2">
        <button type="button" class="btn btn-outline min-w-27.5">
          <Icon name="tabler:arrow-left" size="24" />Cansel
        </button>
        <button type="submit" class="btn btn-primary min-w-27.5">
          Add <Icon name="tabler:circle-plus-filled" size="24" />
        </button>
      </div>
    </form>
  </div>
</template>
