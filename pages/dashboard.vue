<script setup lang="ts">
import SidebarButton from '~/components/sidebarButton.vue';
import {CURRENT_LOCATION_PAGES, LOCATION_PAGES} from "~/lib/constants";

const isSidebarOpen = ref(true);
const ready = ref(false);
const route = useRoute();
const sidebarStore = useSidebarStore();
const locationsStore = useLocationStore();
const mapStore = useMapStore();
const { currentLocation } = storeToRefs(locationsStore);

onMounted(() => {
  const saved = localStorage.getItem('isSidebarOpen');
  if (saved !== null) {
    isSidebarOpen.value = saved === 'true';
  }
  ready.value = true;

  if (route.path !== '/dashboard') {
    locationsStore.refreshLocations();
  }
});

watchEffect(() => {
  if (LOCATION_PAGES.has(route.name?.toString() ?? '')) {
    sidebarStore.sidebarTopItems = [{
      id: 'link-dashboard',
      label: 'Locations',
      href: '/dashboard',
      icon: 'tabler:map'
    },
    {
      id: 'link-location-add',
      label: 'Add Location',
      href: '/dashboard/addLocation',
      icon: 'tabler:circle-plus-filled'
    }]
  } else if (CURRENT_LOCATION_PAGES.has(route.name?.toString() ?? '')) {
    sidebarStore.sidebarTopItems = [{
      id: 'link-dashboard',
      label: 'Back to Locations',
      href: '/dashboard',
      icon: 'tabler:arrow-left'
    }, {
      id: 'link-dashboard',
      label: currentLocation.value ? currentLocation.value.name : 'View Logs',
      to: {
        name: 'dashboard-location-slug',
        params: { slug: currentLocation.value?.slug },
      },
      icon: 'tabler:map'
    }, {
      id: 'link-location-edit',
      label: 'Edit Location',
      to: {
        name: 'dashboard-location-slug-edit',
        params: { slug: currentLocation.value?.slug },
      },
      icon: 'tabler:map-pin-cog'
    },{
      id: 'link-location-add',
      label: 'Add Location Log',
      to: {
        name: 'dashboard-location-slug-add',
        params: { slug: currentLocation.value?.slug },
      },
      icon: 'tabler:circle-plus-filled'
    }]
  }
})

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem('isSidebarOpen', isSidebarOpen.value.toString());
}
</script>

<template>
  <div v-if="ready" class="flex flex-1">
    <div class="bg-base-100 transition-all duration-300 shrink-0" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
      <div
        class="flex p-2 hover:cursor-pointer"
        :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }"
        @click="toggleSidebar"
      >
        <Icon
          v-if="isSidebarOpen"
          name="tabler:square-chevron-left"
          size="24"
        />
        <Icon
          v-else
          name="tabler:square-chevron-right"
          size="24"
        />
      </div>
      <div class="flex flex-col">
        <SidebarButton
           v-for="item in sidebarStore.sidebarTopItems"
           :key="item.id"
           :show-label="isSidebarOpen"
           :href="item.href"
           :to="item.to"
           :label="item.label"
           :icon="item.icon"
        />
        <div v-if="sidebarStore.loading || sidebarStore.sidebarItems.length" class="divider" />
        <div v-if="sidebarStore.loading" class="px-4">
          <div class="skeleton h-4 w-full" />
        </div>
        <div v-if="!sidebarStore.loading && sidebarStore.sidebarItems.length" class="flex flex-col">
          <SidebarButton
            v-for="item in sidebarStore.sidebarItems"
            :key="item.id"
            :label="item.label"
            :icon="item.icon"
            :to="item.to"
            :show-label="isSidebarOpen"
            :icon-color="item.mapPoint?.id === mapStore.selectedPointId ? 'text-primary' : undefined"
            @mouseenter="mapStore.selectedPointId = item.mapPoint?.id ?? null"
            @mouseleave="mapStore.selectedPointId = null"
          />
        </div>
        <div class="divider" />
        <SidebarButton
          :show-label="isSidebarOpen"
          href="/signOut"
          label="Sign Out"
          icon="tabler:logout-2"
        />
      </div>
    </div>
    <div class="flex-1 overflow-auto bg-base-200">
      <div
          class="flex size-full" :class="{'flex-col': route.path !== '/dashboard/addLocation'}">
        <NuxtPage />
        <div class="flex-1 p-2">
          <AppMap />
        </div>
      </div>
    </div>
  </div>
</template>
