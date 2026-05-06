<script setup lang="ts">
import AppDialog from '~/components/app/appDialog.vue';
import { useConfirmDelete } from '~/composables/useConfirmDelete';
import { useLocationRouteParams } from '~/composables/useLocationRouteParams';
import { toDateTimeLocal } from '~/utils/date';

const route = useRoute();
const locationsStore = useLocationStore();
const {
  currentLocationLog: locationLog,
  currentLocationLogStatus: status,
  currentLocationLogError: error,
} = storeToRefs(locationsStore);

const { slug, id, locationRoute } = useLocationRouteParams();

const {
  isOpen,
  deleteError,
  isDeleting,
  openDialog,
  confirmDelete,
} = useConfirmDelete({
  endpoint: () => `/api/locations/${slug.value}/${id.value}`,
  redirectTo: locationRoute,
});

const loading = computed(() => isDeleting.value || status.value === 'pending');
const errorMessage = computed(() => deleteError.value || error.value?.statusMessage);

onMounted(() => {
  locationsStore.refreshCurrentLocationLog();
});

onBeforeRouteUpdate((to) => {
  if (to.name === 'dashboard-location-slug-id') {
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
      <p class="text-sm whitespace-pre-line">
        {{ locationLog.description }}
      </p>
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
