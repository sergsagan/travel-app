<script setup lang="ts">
import { CENTER_EUROPE } from '~/lib/constants';
import { useMapStore } from '~/stores/map';
import type { LngLat} from "maplibre-gl";

import { formatNumber } from "~/utils/formatNumber";
import type { MglEvent } from "@indoorequal/vue-maplibre-gl";


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

function onDubleClick(mglEvent: MglEvent<'dblclick'>) {
  if (mapStore.newPoint) {
    mapStore.newPoint.lat = mglEvent.event.lngLat.lat;
    mapStore.newPoint.long = mglEvent.event.lngLat.lng;
  }
}

await mapStore.init()
</script>

<template>
  <MglMap
      :map-style="style"
      :center="CENTER_EUROPE"
      :zoom="zoom"
      @map:dblclick="onDubleClick"
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
        <p>coordinates: <br/> long: {{ formatNumber(point.long) }}, lat: {{ formatNumber(point.lat) }}</p>
        <div class="flex items-end mt-4">
          <NuxtLink v-if="point.to" :to="point.to" class="btn btn-sm btn-outline">
            {{ point.toLabel }}
          </NuxtLink>
        </div>
      </MglPopup>
    </MglMarker>
    <MglMarker
        draggable
        :coordinates="[mapStore.newPoint.long, mapStore.newPoint.lat]"
        v-if="mapStore.newPoint"
        class-name="z-50"
        @update:coordinates="updateNewPoint"
    >
      <template #marker>
        <div class="tooltip tooltip-top tooltip-open hover:cursor-pointer" data-tip="Drag to your desired location">
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
