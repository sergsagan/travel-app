import { useMapStore } from '~/stores/map';
import type { MapPoint } from "~/lib/types";
import type { SelectLocationWithLogs } from "~/lib/db/schema";

export const useLocationStore = defineStore('useLocationStore', () => {
  const route = useRoute();
  const {
    data: locations,
    status: locationsStatus,
    refresh: refreshLocations
  } = useFetch('/api/locations', {
    lazy: true,
  });

  const {
    data: currentLocation,
    status: currentLocationStatus,
    error: currentLocationError,
    refresh: refreshCurrentLocation
  } = useFetch<SelectLocationWithLogs>(
      () => {
        const slug = route.params.slug
        if (!slug || typeof slug !== 'string') return ''
        return `/api/locations/${slug}`
      },
      {
        lazy: true,
        immediate: false,
      }
  )

  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  watchEffect(() => {
    if (locations.value) {
      const mapPoints: MapPoint[] = [];
      const sidebarItems: SidebarItem[] = [];

      locations.value.forEach((location) => {
        const mapPoint = createMapPointFromLocation(location);
        sidebarItems.push({
          id: `location-${location.id}`,
          label: location.name,
          icon: 'tabler:map-pin-filled',
          to: { name: 'dashboard-location-slug', params: { slug: location.slug }},
          mapPoint,
        });
        mapPoints.push(mapPoint);
      })

      sidebarStore.sidebarItems = sidebarItems;
      mapStore.mapPoints = mapPoints;
    }
    sidebarStore.loading = locationsStatus.value === 'pending';
  });

  return {
    locations,
    locationsStatus,
    refreshLocations,
    currentLocation,
    currentLocationStatus,
    currentLocationError,
    refreshCurrentLocation,
  };
});
