import type { SelectLocation, SelectLocationWithLogs } from '~/lib/db/schema';
import type { MapPoint } from '~/lib/types';

import { CURRENT_LOCATION_PAGES, LOCATION_PAGES } from '~/lib/constants';
import { useMapStore } from '~/stores/map';
import { createMapPointFromLocation, createMapPointFromLocationLog } from '~/utils/mapPoints';

export const useLocationStore = defineStore('useLocationStore', () => {
  const route = useRoute();
  const {
    data: locations,
    status: locationsStatus,
    refresh: refreshLocations,
  } = useFetch<SelectLocation[]>('/api/locations', {
    lazy: true,
  });

  const {
    data: currentLocation,
    status: currentLocationStatus,
    error: currentLocationError,
    refresh: refreshCurrentLocation,
  } = useFetch<SelectLocationWithLogs>(
    () => {
      const slug = route.params.slug;
      return `/api/locations/${slug}`;
    },
    {
      lazy: true,
      immediate: false,
      watch: false,
    },
  );

  watch(
    () => route.params.slug,
    (slug) => {
      if (slug && typeof slug === 'string')
        void refreshCurrentLocation();
    },
    { immediate: true },
  );

  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  watch(
    [
      locations,
      currentLocation,
      () => route.name,
      locationsStatus,
      currentLocationStatus,
    ],
    () => {
      const routeName = route.name?.toString() || '';
      const isLocationPage = LOCATION_PAGES.has(routeName);
      const isCurrentLocationPage = CURRENT_LOCATION_PAGES.has(routeName);

      sidebarStore.loading = isLocationPage
        ? locationsStatus.value === 'pending'
        : isCurrentLocationPage
          ? currentLocationStatus.value === 'pending'
          : false;

      if (sidebarStore.loading) {
        sidebarStore.sidebarItems = [];
        mapStore.mapPoints = [];
        return;
      }

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

        return;
      }

      if (currentLocation.value && isCurrentLocationPage) {
        const location = currentLocation.value;
        const logs = currentLocation.value.locationLogs ?? [];

        const mapPoints: MapPoint[] = [];
        const sidebarItems: SidebarItem[] = [];

        logs.forEach((log) => {
          const mapPoint = createMapPointFromLocationLog(
            log,
            location.slug,
          );

          sidebarItems.push({
            id: `location-log-${log.id}`,
            label: log.name,
            icon: 'tabler:map-pin-filled',
            to: mapPoint.to,
            mapPoint,
          });

          mapPoints.push(mapPoint);
        });

        sidebarStore.sidebarItems = sidebarItems;

        mapStore.mapPoints = mapPoints.length
          ? mapPoints
          : [createMapPointFromLocation(location)];

        return;
      }

      sidebarStore.sidebarItems = [];
      mapStore.mapPoints = [];
    },
    {
      immediate: true,
    },
  );

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
