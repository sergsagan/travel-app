import type { LngLatBounds } from "maplibre-gl";
import type { MapPoint } from '~/lib/types';

export const useMapStore = defineStore('useMapStore', () => {
  const mapPoints = ref<MapPoint[]>([]);
  const selectedPointId = ref<number | null>(null);

  const selectedPoint = computed(() =>
      mapPoints.value.find(p => p.id === selectedPointId.value) ?? null
  )
  const newPoint = ref<MapPoint & { centerMap?: boolean} | null>(null);
  const shouldFlyTo= ref(true);

  function selectedPointWithFlyTo(point: MapPoint | null) {
    shouldFlyTo.value = false;
    selectedPointId.value = point?.id ?? null;
  }

  async function init() {
    const { LngLatBounds } = await import("maplibre-gl");
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");

    const map = useMap();

    let bounds: LngLatBounds | null = null;
    const padding = 60;

    effect(() => {
      const firstPoint = mapPoints.value[0];

      if (!firstPoint) {
        return;
      }
      bounds = mapPoints.value.reduce((bounds, point) => {
        return bounds.extend([point.long, point.lat]);
      },new LngLatBounds([firstPoint.long, firstPoint.lat], [firstPoint.long, firstPoint.lat]));
    })

    effect(() => {
        if (newPoint.value) return;
        if (selectedPoint.value) {
          if (shouldFlyTo.value) {
            map.map?.flyTo({
              center: [selectedPoint.value.long, selectedPoint.value.lat],
              zoom: 6,
              speed: 0.5
            })
          }
          shouldFlyTo.value = true;
        } else if (bounds) {
          map.map?.fitBounds(bounds, {
            padding,
          });
        }
    });

    watch(newPoint, (newValue, oldValue) => {
      if ((newValue && !oldValue) || newValue?.centerMap) {
        map.map?.flyTo({
            center: [newValue.long, newValue.lat],
            speed: 0.8,
            zoom: 6,
        })
      }
    }, { immediate: true });
  }

  return {
    init,
    newPoint,
    mapPoints,
    selectedPoint,
    selectedPointId,
    selectedPointWithFlyTo,
  };
});
