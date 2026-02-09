<script setup lang="ts">

</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl">locations</h2>
    <div class="flex flex-col gap-2 mt-4">
      <p>Add location to get started</p>
      <NuxtLink to="/dashboard/addLocation" class="btn btn-primary w-40">
        Add Location
        <Icon name="tabler:circle-plus-filled" size="24"/>
      </NuxtLink>
    </div>
  </div>
</template>
