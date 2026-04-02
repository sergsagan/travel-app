<script setup lang="ts">
import type { ZodType } from 'zod';
import FormField from "~/components/app/formField.vue";
import PlaceSearch from "~/components/app/placeSearch.vue";
import { CENTER_EUROPE } from "~/lib/constants";
import { InsertLocation } from "~/lib/db/schema";
import type { NominatimResult } from "~/lib/types";
import { formatNumber } from "~/utils/formatNumber";

const props = defineProps<{
  onSubmit: (location: InsertLocation) => Promise<any>;
  loading: boolean;
  submitted: boolean;
  submitErrors: Record<string, string>;
}>();

const mapStore = useMapStore();
const router = useRouter();

const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
  validationSchema: toTypedSchema(InsertLocation as unknown as ZodType),
  initialValues: {
    name: '',
    description: '',
    lat: CENTER_EUROPE[1],
    long: CENTER_EUROPE[0],
  },
});

const onSubmit = handleSubmit(props.onSubmit);

function searchResultSelected(result: NominatimResult) {
  setFieldValue('name', result.display_name);
  mapStore.newPoint = {
    id: 1,
    name: 'New Point',
    description: '',
    long: Number(result.lon),
    lat: Number(result.lat),
  }
}

effect(() => {
  setErrors(props.submitErrors);
})

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
  if (!props.submitted && meta.value.dirty) {
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
    <p class="text-xs text-gray-400">
      Current location: {{ formatNumber(controlledValues.lat) }}, {{ formatNumber(controlledValues.long) }}
    </p>
    <p>
      To set the coordinates:
    </p>
    <ul class="list-disc ml-4 text-sm">
      <li>
        <p>Drag the <Icon name="tabler:map-pin-filled" class="text-warning" /> marker on the map</p>
      </li>
      <li>
        Double click on the map
      </li>
      <li>
        Search for a location below.
      </li>
    </ul>
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
        Add Location
        <span v-if="loading" class="loading loading-spinner loading-sm" />
        <Icon
            v-else
            name="tabler:circle-plus-filled"
            size="24"
        />
      </button>
    </div>
  </Form>
  <div class="divider" />
  <PlaceSearch @result-selected="searchResultSelected" />
</template>
