import { useMapStore } from '~/stores/map';
import type { MapPoint } from "~/lib/types";
import type { SelectLocation, SelectLocationWithLogs } from "~/lib/db/schema";
import { createMapPointFromLocation } from '~/utils/mapPoints';
import { CURRENT_LOCATION_PAGES, LOCATION_PAGES } from "~/lib/constants";

export const useLocationStore = defineStore('useLocationStore', () => {
  const route = useRoute();
  const {
    data: locations,
    status: locationsStatus,
    refresh: refreshLocations
  } = useFetch<SelectLocation[]>('/api/locations', {
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
    const routeName = route.name?.toString() || '';
    const isLocationPage = LOCATION_PAGES.has(routeName);
    const isCurrentLocationPage = CURRENT_LOCATION_PAGES.has(routeName);

    if (locations.value && isLocationPage) {
      const mapPoints: MapPoint[] = [];
      const sidebarItems: SidebarItem[] = [];

      locations.value.forEach((location) => {
        const mapPoint = createMapPointFromLocation(location);
        sidebarItems.push({
          id: `location-${location.id}`,
          label: location.name,
          icon: 'tabler:map-pin-filled',
          to: mapPoint.to,
          mapPoint,
        });
        mapPoints.push(mapPoint);
      });

      sidebarStore.sidebarItems = sidebarItems;
      mapStore.mapPoints = mapPoints;
    } else if (currentLocation.value && isCurrentLocationPage) {
      sidebarStore.sidebarItems = [];
      mapStore.mapPoints = [currentLocation.value];
    }

    if (isCurrentLocationPage) {
      sidebarStore.loading = currentLocationStatus.value === 'pending';
    } else if (isLocationPage) {
      sidebarStore.loading = locationsStatus.value === 'pending';
    } else {
      sidebarStore.loading = false;
    }
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
