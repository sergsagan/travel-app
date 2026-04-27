<script setup lang="ts" generic="T extends LatLongItem">
import type { FetchError } from 'ofetch';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import PlaceSearch from "~/components/app/placeSearch.vue";
import { CENTER_EUROPE } from "~/lib/constants";
import type { FormValues, LatLongItem, NominatimResult } from "~/lib/types";
import { formatNumber } from "~/utils/formatNumber";
import type { ZodType } from "zod";

const props = defineProps<{
  initialValues: T;
  schema: ZodType<any, any, any>;
  onSubmit: (location: T) => Promise<void>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
  zoom: number;
}>();

const mapStore = useMapStore();
const router = useRouter();
const submitError = ref('');
const loading = ref(false);
const submitted = ref(false);
const validationSchema = toTypedSchema(props.schema);

const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm<FormValues>({
  validationSchema,
  initialValues: props.initialValues,
});

const onSubmit = handleSubmit(async (values: any) => {
  try {
    submitError.value = '';
    loading.value = true;
    await props.onSubmit(values);
    submitted.value = true;
    props.onSubmitComplete();
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      setErrors(error.data?.data);
    }
    submitError.value = getFetchErrorMessage(error);
  }
  loading.value = false;
});

function searchResultSelected(result: NominatimResult) {
  setFieldValue('name', result.display_name);
  mapStore.newPoint = {
    id: 1,
    name: 'New Point',
    description: '',
    lat: Number(result.lat),
    long: Number(result.lon),
  }
}

watch(
    () => [mapStore.newPoint?.lat, mapStore.newPoint?.long],
    ([lat, long]) => {
      if (lat != null && long != null) {
        setFieldValue('lat', lat)
        setFieldValue('long', long)
      }
    }
)

onMounted(() => {
  mapStore.newPoint = {
    id: 1,
    name: 'New Point',
    description: '',
    lat: props.initialValues?.lat || CENTER_EUROPE[1],
    long: props.initialValues?.long || CENTER_EUROPE[0],
    zoom: props.zoom,
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
  <div>
    <div v-if="submitError" role="alert" class="alert alert-error">
      <span>{{ submitError }}</span>
    </div>
    <form class="flex flex-col gap-1" @submit.prevent="onSubmit">
      <slot :errors="errors" :loading="loading" />
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
      <div class="flex justify-end gap-2 mt-4">
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
          {{ props.submitLabel }}
          <span v-if="loading" class="loading loading-spinner loading-sm" />
          <Icon
              v-else
              :name="props.submitIcon"
              size="24"
          />
        </button>
      </div>
    </form>
    <div class="divider" />
    <PlaceSearch @result-selected="searchResultSelected" />
  </div>
</template>
