<script setup lang="ts">
import { CURRENT_LOCATION_PAGES } from '~/lib/constants';
import AppDialog from "~/components/app/appDialog.vue";
import type { FetchError } from 'ofetch';
import { createMapPointFromLocationLog } from "~/utils/mapPoints";
import { toDateTimeLocal } from '~/utils/date';

const route = useRoute();
const locationsStore = useLocationStore();
const { getCsrfHeaders } = useCsrfHeaders();
const { currentLocation: location, currentLocationStatus: status, currentLocationError: error } = storeToRefs(locationsStore);

const isOpen = ref(false);
const deleteError = ref('');
const isDeleting = ref(false);

const loading = computed(() => status.value === 'pending' || isDeleting.value);
const errorMessage = computed(() => error.value?.statusMessage || deleteError.value);

function openDialog() {
  isOpen.value = true;
  (document.activeElement as HTMLAnchorElement)?.blur();
}

async function confirmDelete() {
  try {
    isOpen.value = false;
    deleteError.value = '';
    isDeleting.value = true;
    await $fetch(`/api/locations/${route.params.slug}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        ...getCsrfHeaders(),
      },
    });
    navigateTo('/dashboard');
  }
  catch (e) {
    const error = e as FetchError;
    deleteError.value = getFetchErrorMessage(error);
  }
  isDeleting.value = false;
}

onMounted(() => {
  locationsStore.refreshCurrentLocation();
})

onBeforeRouteUpdate((to, from) => {
  const toName = to.name?.toString() || '';
  const isCurrentLocationPage = CURRENT_LOCATION_PAGES.has(toName);
  const slugChanged = to.params.slug !== from.params.slug;
  const routeChanged = to.name !== from.name;

  if (isCurrentLocationPage && (slugChanged || routeChanged)) {
    locationsStore.refreshCurrentLocation();
  }
})
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
    <div v-if="route.name === 'dashboard-location-slug' && location && !loading">
      <h2 class="text-xl">
        {{ location.name }}
        <div class="dropdown dropdown-bottom">
          <div tabindex="0" role="button" class="btn btn-sm m-1 p-0">
            <Icon name="tabler:dots-vertical" size="20" />
          </div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <NuxtLink @click="openDialog">
                Delete
                <Icon name="tabler:trash-x-filled" size="20" />
              </NuxtLink>
            </li>
            <li>
              <NuxtLink v-if="location?.slug" :to="{ name: 'dashboard-location-slug-edit', params: { slug: location.slug } }">
                Edit
                <Icon name="tabler:map-pin-cog" size="20" />
              </NuxtLink>
            </li>
          </ul>
        </div>
      </h2>
      <p class="text-sm">{{ location.description }}</p>
      <div v-if="(location.locationLogs?.length ?? 0) === 0" class="mt-4">
        <p class="text-sm italic">
          Add a location log to get started
        </p>
        <NuxtLink
            v-if="location?.slug"
            :to="{ name: 'dashboard-location-slug-add', params:{ slug: location.slug }}"
            class="btn btn-primary mt-2"
        >
          Add Location Log
          <Icon name="tabler:map-pin-plus" size="24" />
        </NuxtLink>
      </div>
    </div>
    <div v-if="route.name === 'dashboard-location-slug' && (location?.locationLogs?.length ?? 0) > 0" class="location-list">
      <LocationCard
          v-for="log in location?.locationLogs"
          :key="log.id"
          :map-point="createMapPointFromLocationLog(log, location?.slug)"
      >
        <template v-slot:top>
          <p class="text-small italic text-gray-500">
            <span v-if="log.startedAt !== log.endedAt">
              {{ toDateTimeLocal(log.startedAt) }} / {{ toDateTimeLocal(log.endedAt) }}
            </span>
            <span v-else>
              {{ toDateTimeLocal(log.startedAt) }}
            </span>
          </p>
        </template>
      </LocationCard>
    </div>
    <div v-if="route.name !== 'dashboard-location-slug'" class="mt-4">
      <NuxtPage />
    </div>
    <AppDialog
        title="Are you sure"
        description="Deleting this location will also delete all of the associated logs. This action cannot be undone. Do you really want to do this?"
        confirm-label="Delete"
        confirm-class="btn-error"
        :is-open="isOpen"
        @on-closed="isOpen = false"
        @on-confirmed="confirmDelete"
    />
  </div>
</template>
