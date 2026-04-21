<script setup lang="ts">
import FormField from "~/components/app/formField.vue";
import type { InsertLocation } from "~/lib/db/schema/location";
import { CENTER_EUROPE } from "~/lib/constants";
import LocationBaseForm from "~/components/locationBaseForm.vue";
import { LocationFormSchema } from "~/lib/zodSchemas";

const props = defineProps<{
  initialValues?: InsertLocation;
  onSubmit: (location: InsertLocation) => Promise<void>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
  zoom?: number;
}>();

const schema = LocationFormSchema;
</script>

<template>
<LocationBaseForm
    v-slot="{ errors, loading }"
    :zoom="props.zoom || 6"
    :schema="schema"
    :initial-values="props.initialValues ||
    { name: '',
      description: '',
      lat: CENTER_EUROPE[1],
      long: CENTER_EUROPE[0]
    }"
    :onSubmit
    :onSubmitComplete
    :submitLabel
    :submitIcon
>
  <FormField
      label="Location Name:"
      name="name"
      type="text"
      :error="errors.name"
      :disabled="loading"
  />
  <FormField
      label="Description:"
      name="description"
      type="textarea"
      :error="errors.description"
      :disabled="loading"
  />
</LocationBaseForm>
</template>
