<script setup lang="ts">
import { CENTER_EUROPE } from '~/lib/constants';
import { useMapStore } from '~/stores/map';
import type {LngLat} from "maplibre-gl";
import { formatNumber } from "~/utils/formatNumber";

const mapStore = useMapStore();
const colorMode = useColorMode();

const style = computed(() =>
  colorMode.value === 'dark'
    ? '/styles/dark.json'
    : 'https://tiles.openfreemap.org/styles/liberty');
const zoom = 3;

function updateNewPoint(location: LngLat) {
  if (mapStore.newPoint) {
    mapStore.newPoint.lat = location.lat;
    mapStore.newPoint.long = location.lng;
  }
}

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
            @mouseenter="mapStore.selectedPointWithFlyTo(point)"
            @mouseleave="mapStore.selectedPointWithFlyTo(null)"
            class="tooltip tooltip-top hover:cursor-pointer"
            :class="{
              'tooltip-open': mapStore.selectedPointId === point.id
            }"
            :data-tip="point.name"
        >
          <Icon
              name="tabler:map-pin-filled"
              size="30"
              class="drop-shadow-lg hover:scale-120 transition-transform"
              :class="mapStore.selectedPointId === point.id ? 'text-primary' : 'text-secondary'"
          />
        </div>
      </template>
      <MglPopup>
        <h3 class="text-xl">{{ point.name }}</h3>
        <p v-if="point.description">{{ point.description }}</p>
        <p>long: {{ formatNumber(point.long) }}</p>
        <p>lat: {{ formatNumber(point.lat) }}</p>
      </MglPopup>
    </MglMarker>
    <MglMarker
        draggable
        :coordinates="CENTER_EUROPE"
        v-if="mapStore.newPoint"
        @update:coordinates="updateNewPoint"
    >
      <template #marker>
        <div class="tooltip tooltip-top hover:cursor-pointer" data-tip="Drag to your desired location">
          <Icon
              name="tabler:map-pin-filled"
              size="35"
              class="drop-shadow-lg hover:scale-120 transition-transform text-warning"
          />
        </div>
      </template>
    </MglMarker>
  </MglMap>
</template>
