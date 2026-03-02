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
        <div class="tooltip tooltip-top" :data-tip="point.label">
          <Icon
              name="tabler:map-pin-filled"
              size="30"
              class="text-primary drop-shadow-lg hover:scale-110 transition-transform"/>
        </div>
      </template>
      <MglPopup>
        <h3 class="text-xl">{{ point.label }}</h3>
        <p v-if="point.description">{{ point.description }}</p>
        <p>long: {{ point.long }}</p>
        <p>lat: {{ point.lat }}</p>
      </MglPopup>
    </MglMarker>
  </MglMap>
</template>
