import type { LngLatBounds } from "maplibre-gl";
import type { MapPoint } from '~/lib/types';
import {CENTER_EUROPE} from "~/lib/constants";

export const useMapStore = defineStore('useMapStore', () => {
  const mapPoints = shallowRef<MapPoint[]>([]);
  const selectedPointId = ref<number | null>(null);
  let stopWatchers: Array<() => void> = [];

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
      selectedPointId.value !== null
          ? mapPointsById.value.get(selectedPointId.value) ?? null
          : null
  )
  const newPoint = ref<MapPoint & { centerMap?: boolean; zoom?: number } | null>(null);
  const shouldFlyTo= ref(true);

  function selectedPointWithFlyTo(point: MapPoint | null) {
    shouldFlyTo.value = false;
    selectedPointId.value = point?.id ?? null;
  }

  function cleanupWatchers() {
    stopWatchers.forEach(stop => stop());
    stopWatchers = [];
  }

  onScopeDispose(() => {
    cleanupWatchers();
  });

  async function init() {
    cleanupWatchers();

    const { LngLatBounds } = await import("maplibre-gl");
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");

    const map = useMap();

    const bounds = shallowRef<LngLatBounds | null>(null);
    const padding = 60;

    const stopBoundsWatcher = watch(mapPoints, (points) => {
      const validPoints = points.filter(isValidCoord);

      const firstPoint = validPoints[0];

      if (!firstPoint) {
        bounds.value = null;
        map.map?.flyTo({
          center: CENTER_EUROPE,
          zoom: 2
        })
        return;
      }

      if (validPoints.length === 1) {
        bounds.value = null;
        return;
      }

      bounds.value = points.reduce((computedBounds, point) => {
        if (!isValidCoord(point)) return computedBounds;

        return computedBounds.extend([point.long, point.lat]);
      },new LngLatBounds([firstPoint.long, firstPoint.lat], [firstPoint.long, firstPoint.lat]));
    }, { immediate: true })

    const stopSelectionWatcher = watchEffect(() => {
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
        } else if (bounds.value) {
          map.map?.fitBounds(bounds.value, {
            padding,
            maxZoom: 12,
          });
        }
    });

    const stopNewPointWatcher = watch(newPoint, (newValue, oldValue) => {
      if ((newValue && !oldValue) || newValue?.centerMap) {
        map.map?.flyTo({
            center: [newValue.long, newValue.lat],
            speed: 0.5,
            zoom: newValue.zoom || 6,
        })
      }
    }, { immediate: true });

    stopWatchers = [stopBoundsWatcher, stopSelectionWatcher, stopNewPointWatcher];
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
