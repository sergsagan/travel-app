<script setup lang="ts">
import { toDateTimeLocal } from "~/utils/date";
import AppDialog from "~/components/app/appDialog.vue";
import type { FetchError } from 'ofetch';

const route = useRoute();
const locationsStore = useLocationStore();
const { getCsrfHeaders } = useCsrfHeaders();
const {
  currentLocationLog: locationLog,
  currentLocationLogStatus: status,
  currentLocationLogError: error
} = storeToRefs(locationsStore);

const isOpen = ref(false);
const deleteError = ref('');
const isDeleting = ref(false);

const loading = computed(() => isDeleting.value || status.value === 'pending');
const errorMessage = computed(() => deleteError.value || error.value?.statusMessage);

const slug = computed(() => route.params.slug as string);
const id = computed(() => route.params.id as string);

async function confirmDelete() {
  try {
    isOpen.value = false;
    deleteError.value = '';
    isDeleting.value = true;
    await $fetch(`/api/locations/${slug.value}/${id.value}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        ...getCsrfHeaders(),
      },
    });
    navigateTo({
      name: 'dashboard-location-slug',
      params: { slug: slug.value },
    });
  }
  catch (e) {
    const error = e as FetchError;
    deleteError.value = getFetchErrorMessage(error);
  }
  isDeleting.value = false;
}

function openDialog() {
  isOpen.value = true;
  (document.activeElement as HTMLAnchorElement)?.blur();
}

onMounted(() => {
  locationsStore.refreshCurrentLocationLog();
})

onBeforeRouteUpdate((to) => {
  if (to.name === "dashboard-location-slug-id") {
    locationsStore.refreshCurrentLocationLog();
  }
});
</script>

<template>
  <div class="page-content-top">
    <div v-if="loading">
      <div class="loading" />
    </div>
    <div v-if="errorMessage && !loading" class="alert alert-error">
      <h2 class="text-xl">
        {{ errorMessage }}
      </h2>
    </div>
    <div v-if="route.name === 'dashboard-location-slug-id' && locationLog && !loading">
      <p class="text-small italic text-gray-500">
        <span v-if="locationLog.startedAt !== locationLog.endedAt">
          {{ toDateTimeLocal(locationLog.startedAt) }} / {{ toDateTimeLocal(locationLog.endedAt) }}
        </span>
        <span v-else>
          {{ toDateTimeLocal(locationLog.startedAt) }}
        </span>
      </p>
      <h2 class="text-xl">
        {{ locationLog.name }}
        <div class="dropdown dropdown-bottom">
          <div
              tabindex="0"
              role="button"
              class="btn m-1 btn-sm p-0"
          >
            <Icon name="tabler:dots-vertical" size="20" />
          </div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <NuxtLink @click="openDialog">
                <Icon name="tabler:trash-x-filled" size="20" />
                Delete
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                  :to="{
                  name: 'dashboard-location-slug-id-edit',
                  params: { slug, id },
                }"
              >
                <Icon name="tabler:map-pin-cog" size="20" />
                Edit
              </NuxtLink>
            </li>
          </ul>
        </div>
      </h2>
      <p class="text-sm whitespace-pre-line">{{ locationLog.description }}</p>
    </div>
    <div v-else>
      <NuxtPage />
    </div>
    <AppDialog
        title="Are you sure"
        description="Deleting this location log cannot be undone. Do you really want to do this?"
        confirm-label="Delete"
        confirm-class="btn-error"
        :is-open="isOpen"
        @on-closed="isOpen = false"
        @on-confirmed="confirmDelete"
    />
  </div>
</template>
