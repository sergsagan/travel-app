<script setup lang="ts">
const isSidebarOpen = ref(true);
</script>

<template>
  <div class="flex flex-1">
    <div class="bg-base-100" :class="{'w-48': isSidebarOpen, 'w-16': !isSidebarOpen }">
      <div class="flex p-2 hover:cursor-pointer" :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }" @click="isSidebarOpen = !isSidebarOpen">
        <Icon v-if="isSidebarOpen" name="tabler:square-chevron-left" size="24" />
        <Icon v-else name="tabler:square-chevron-right" size="24" />
      </div>
      <div class="flex flex-col">
        <SidebarItem :showLabel="isSidebarOpen" href="/dashboard" label="Locations" icon="tabler:map-2" />
        <SidebarItem :showLabel="isSidebarOpen" href="/dashboard/add" label="Add Location" icon="tabler:circle-plus-filled" />
        <div class="divider" />
        <SidebarItem :showLabel="isSidebarOpen" href="/signOut" label="Sign Out" icon="tabler:logout-2" />
      </div>
    </div>
    <div class="flex-1" />
  </div>
</template>
