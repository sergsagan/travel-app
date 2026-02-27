import type { MapPoint } from '~/lib/types';

export const useMapStore = defineStore('useMapStore', () => {
  const mapPoints = ref<MapPoint[]>([]);

  return {
    mapPoints,
  };
});
