<script setup lang="ts">
import SidebarButton from '~/components/sidebarButton.vue';

const isSidebarOpen = ref(true);
const ready = ref(false);
const route = useRoute();
const sidebarStore = useSidebarStore();
const locationsStore = useLocationStore();
const mapStore = useMapStore();

onMounted(() => {
  const saved = localStorage.getItem('isSidebarOpen');
  if (saved !== null) {
    isSidebarOpen.value = saved === 'true';
  }
  ready.value = true;

  if (route.path !== '/dashboard') {
    locationsStore.refresh();
  }
});

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
          :show-label="isSidebarOpen"
          href="/dashboard"
          label="Locations"
          icon="tabler:map-2"
        />
        <SidebarButton
          :show-label="isSidebarOpen"
          href="/dashboard/addLocation"
          label="Add Location"
          icon="tabler:circle-plus-filled"
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
            :href="item.href"
            :show-label="isSidebarOpen"
            :icon-color="mapStore.selectedPoint?.id === item.location?.id ? 'text-primary' : undefined"
            @mouseenter="mapStore.selectedPointId = item.location?.id ?? null"
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
    <div class="flex-1 overflow-auto">
      <div class="flex flex-col size-full">
        <NuxtPage />
        <div class="flex-1">
          <AppMap />
        </div>
      </div>
    </div>
  </div>
</template>
