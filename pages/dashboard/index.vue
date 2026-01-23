<script setup lang="ts">

</script>

<template>
  <div class="flex flex-1">
    <div class="bg-base-100 w-64">
      <div class="flex justify-end">
        <Icon name="tabler:chevron-left" size="42" />
      </div>
      <div class="flex flex-col">
        <SidebarItem href="/dashboard" label="Locations" icon="tabler:map-2" />
        <SidebarItem href="/dashboard/add" label="Add Location" icon="tabler:circle-plus-filled" />
        <div class="divider" />
        <SidebarItem href="/signOut" label="Sign Out" icon="tabler:logout-2" />
      </div>
    </div>
    <div class="flex-1"></div>
  </div>
</template>
