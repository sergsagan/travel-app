<script setup lang="ts">
const isSidebarOpen = ref(true);

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem('isSidebarOpen') === 'true';
});

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem('isSidebarOpen', isSidebarOpen.value.toString());
}
</script>

<template>
  <div class="flex flex-1">
    <div class="bg-base-100 transition-all duration-300" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
      <div class="flex p-2 hover:cursor-pointer" :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }" @click="toggleSidebar">
        <Icon v-if="isSidebarOpen" name="tabler:square-chevron-left" size="24" />
        <Icon v-else name="tabler:square-chevron-right" size="24" />
      </div>
      <div class="flex flex-col">
        <SidebarItem
          :show-label="isSidebarOpen"
          href="/dashboard"
          label="Locations"
          icon="tabler:map-2"
        />
        <SidebarItem
          :show-label="isSidebarOpen"
          href="/dashboard/addLocation"
          label="Add Location"
          icon="tabler:circle-plus-filled"
        />
        <div class="divider" />
        <SidebarItem
          :show-label="isSidebarOpen"
          href="/signOut"
          label="Sign Out"
          icon="tabler:logout-2"
        />
      </div>
    </div>
    <div class="flex-1">
      <NuxtPage />
    </div>
  </div>
</template>
