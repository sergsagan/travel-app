<script setup lang="ts">
const { data, status } = await useFetch('/api/locations', {
  lazy: true
});

const sidebarStore = useSidebarStore();

watchEffect(() => {
  if (data.value) {
    sidebarStore.sidebarItems = data.value.map((location) => ({
      id: `location-${location.id}`,
      label: location.name,
      icon: 'tabler:map-pin-filled',
      href: '#'
    }));
  }
  sidebarStore.loading = status.value === 'pending';
});
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl ml-4">Locations</h2>
    <div v-if="status === 'pending'">
      <span class="loading loading-spinner loading-xl"></span>
    </div>
    <div v-else-if="data && data.length > 0" class="flex flex-wrap justify-start gap-2 mt-4">
      <div class="card card-compact bg-base-200 h-40 w-72" v-for="location in data" :key="location.id">
        <div class="card-body">
          <h3 class="text-xl">{{ location.name }}</h3>
          <p>{{ location.description }}</p>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col gap-2 mt-4">
      <p>Add location to get started</p>
      <NuxtLink to="/dashboard/addLocation" class="btn btn-primary w-40">
        Add Location
        <Icon name="tabler:circle-plus-filled" size="24"/>
      </NuxtLink>
    </div>
  </div>
</template>
