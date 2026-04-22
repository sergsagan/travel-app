<script setup lang="ts">
import type { MapPoint } from "~/lib/types";
import { computed } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import { hasValidTo } from '~/utils/link';

const mapStore = useMapStore();
const props = defineProps<{
  mapPoint: MapPoint;
}>();

function hasSlug(x: unknown): x is { slug: string } {
  return !!x && typeof (x as Record<string, unknown>).slug === 'string';
}

const linkTo = computed<RouteLocationRaw | string>(() => {
  const mp = props.mapPoint;
  if (mp?.to && hasValidTo(mp.to)) return mp.to as RouteLocationRaw;
  if (hasSlug(mp)) return { name: 'dashboard-location-slug', params: { slug: mp.slug } };
  return '/';
});
</script>

<template>
  <NuxtLink
      v-if="props.mapPoint"
      :to="linkTo"
      class="card card-compact bg-base-200 border-2 h-40 w-72 mb-4 shrink-0 hover:cursor-pointer transition-colors"
      :class="(props.mapPoint?.id === mapStore.selectedPointId) ? 'border-primary' : 'border-transparent'"
      @mouseenter="mapStore.selectedPointId = props.mapPoint?.id"
      @mouseleave="mapStore.selectedPointId = null"
  >
    <div class="card-body">
      <h3 class="text-xl truncate">
        {{ props.mapPoint?.name }}
      </h3>
          <p class="line-clamp-4 wrap-break-word">{{ props.mapPoint?.description }}</p>
    </div>
  </NuxtLink>
  <div v-else class="card card-compact bg-base-200 border-2 h-40 w-72 mb-4 shrink-0" />
</template>
