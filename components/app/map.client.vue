<script setup lang="ts">
//const style = 'https://tiles.openfreemap.org/styles/liberty';
const style = '/styles/dark.json';
const center = [43.30, 16.26];
const zoom = 8;
</script>

<template>
  <MglMap
      :map-style="style"
      :center="center"
      :zoom="zoom"
  >
    <MglNavigationControl />
  </MglMap>
</template>

<style scoped>

</style>
