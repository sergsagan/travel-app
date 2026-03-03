<script setup lang="ts">
import { CENTER_EUROPE } from '~/lib/constants';
import { useMapStore } from '~/stores/map';

const mapStore = useMapStore();
const colorMode = useColorMode();

const style = computed(() =>
  colorMode.value === 'dark'
    ? '/styles/dark.json'
    : 'https://tiles.openfreemap.org/styles/liberty');
const zoom = 3;

onMounted(() => {
  mapStore.init()
})
</script>

<template>
  <MglMap
      :map-style="style"
      :center="CENTER_EUROPE"
      :zoom="zoom"
  >
    <MglNavigationControl />
    <MglMarker
      v-for="point in mapStore.mapPoints"
      :key="point.id"
      :coordinates="[point.long, point.lat]"
    >
      <template #marker>
        <div
            @mouseenter="mapStore.selectedPointId = point.id"
            @mouseleave="mapStore.selectedPointId = null"
            class="tooltip tooltip-top hover:cursor-pointer"
            :data-tip="point.name"
        >
          <Icon
              name="tabler:map-pin-filled"
              size="30"
              class="drop-shadow-lg hover:scale-110 transition-transform"
              :class="mapStore.selectedPointId === point.id ? 'text-primary' : 'text-secondary'" />
        </div>
      </template>
      <MglPopup>
        <h3 class="text-xl">{{ point.name }}</h3>
        <p v-if="point.description">{{ point.description }}</p>
        <p>long: {{ point.long }}</p>
        <p>lat: {{ point.lat }}</p>
      </MglPopup>
    </MglMarker>
  </MglMap>
</template>
