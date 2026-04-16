<script setup lang="ts">
import FormField from "~/components/app/formField.vue";
import {type InsertLocation, InsertLocationSchema} from "~/lib/db/schema/location";
import { CENTER_EUROPE } from "~/lib/constants";
import LocationBaseForm from "~/components/locationBaseForm.vue";
import type { ZodTypeAny } from "zod";

const props = defineProps<{
  initialValues?: InsertLocation;
  onSubmit: (location: InsertLocation) => Promise<void>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
}>();

const schema = InsertLocationSchema as unknown as ZodTypeAny;
</script>

<template>
<LocationBaseForm
    v-slot="{ errors, loading }"
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
</LocationBaseForm>
</template>
