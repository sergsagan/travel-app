<script setup lang="ts">
import FormField from "~/components/app/formField.vue";
import DateField from "~/components/app/dateField.vue";
import type { InsertLocationLog } from "~/lib/db/schema/locationLog";
import { CENTER_EUROPE } from "~/lib/constants";
import LocationBaseForm from "~/components/locationBaseForm.vue";
import { LocationLogFormSchema } from "~/lib/zodSchemas";


const props = defineProps<{
  initialValues?: InsertLocationLog;
  onSubmit: (location: InsertLocationLog) => Promise<void>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
}>();

const schema = LocationLogFormSchema;
const defaultInitialValues: InsertLocationLog = {
  name: '',
  description: '',
  lat: CENTER_EUROPE[1],
  long: CENTER_EUROPE[0],
  startedAt: Date.now() - (24 * 60 * 60 * 1000),
  endedAt: Date.now(),
};
</script>

<template>
  <LocationBaseForm
      v-slot="{ errors, loading }"
      :zoom="12"
      :schema="schema"
      :initial-values="props.initialValues || defaultInitialValues"
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
    <DateField
        label="Start date & time:"
        name="startedAt"
        :value="(props.initialValues || defaultInitialValues).startedAt"
        :error="errors.startedAt"
        :disabled="loading"
    />
    <DateField
        label="End date & time:"
        name="endedAt"
        :value="(props.initialValues || defaultInitialValues).endedAt"
        :error="errors.endedAt"
        :disabled="loading"
    />
  </LocationBaseForm>
</template>
