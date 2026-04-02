import type { LngLatBounds } from "maplibre-gl";
import type { MapPoint } from '~/lib/types';

export const useMapStore = defineStore('useMapStore', () => {
  const mapPoints = shallowRef<MapPoint[]>([]);
  const selectedPointId = ref<number | null>(null);

  function isValidCoord(point: { lat: any; long: any }) {
    return (
        typeof point.lat === 'number' &&
        typeof point.long === 'number' &&
        !Number.isNaN(point.lat) &&
        !Number.isNaN(point.long)
    )
  }

  const mapPointsById = computed(() =>
      new Map(mapPoints.value.map(p => [p.id, p]))
  )

  const selectedPoint = computed(() =>
      selectedPointId.value
          ? mapPointsById.value.get(selectedPointId.value) ?? null
          : null
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

    watchEffect(() => {
      const firstPoint = mapPoints.value.find(isValidCoord)

      if (!firstPoint) {
        return;
      }
      bounds = mapPoints.value.reduce((bounds, point) => {
        if (!isValidCoord(point)) return bounds;

        return bounds.extend([point.long, point.lat]);
      },new LngLatBounds([firstPoint.long, firstPoint.lat], [firstPoint.long, firstPoint.lat]));
    })

    watchEffect(() => {
        if (newPoint.value) return;
        if (selectedPoint.value && isValidCoord(selectedPoint.value)) {
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
            maxZoom: 12,
          });
        }
    });

    watch(newPoint, (newValue, oldValue) => {
      if ((newValue && !oldValue) || newValue?.centerMap) {
        map.map?.flyTo({
            center: [newValue.long, newValue.lat],
            speed: 0.5,
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
