import type { SelectLocation, SelectLocationLog, SelectLocationWithLogs } from '~/lib/db/schema';
import type { MapPoint } from '~/lib/types';

import {
  CURRENT_LOCATION_LOG_PAGES,
  CURRENT_LOCATION_PAGES,
  LOCATION_PAGES,
} from '~/lib/constants';
import { useMapStore } from '~/stores/map';
import { createMapPointFromLocation, createMapPointFromLocationLog } from '~/utils/mapPoints';

export const useLocationStore = defineStore('useLocationStore', () => {
  const route = useRoute();

  const locationUrlWithSlug = computed(() => `/api/locations/${route.params.slug}`);
  const locationLogUrlWithSlugAndId = computed(() => `/api/locations/${route.params.slug}/${route.params.id}`);

  const {
    data: locations,
    status: locationsStatus,
    refresh: refreshLocations,
  } = useFetch<SelectLocation[]>('/api/locations', {
    lazy: true,
    immediate: false,
  });

  const {
    data: currentLocation,
    status: currentLocationStatus,
    error: currentLocationError,
    refresh: refreshCurrentLocation,
  } = useFetch<SelectLocationWithLogs>(locationUrlWithSlug, {
    lazy: true,
    immediate: false,
    watch: false,
  });

  const {
    data: currentLocationLog,
    status: currentLocationLogStatus,
    error: currentLocationLogError,
    refresh: refreshCurrentLocationLog,
  } = useFetch<SelectLocationLog>(locationLogUrlWithSlugAndId, {
    lazy: true,
    immediate: false,
    watch: false,
  });

  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  watch(
    () => route.params.slug,
    (slug) => {
      if (slug && typeof slug === 'string')
        void refreshCurrentLocation();
    },
    { immediate: true },
  );

  watch(
    [() => route.params.slug, () => route.params.id, () => route.name],
    ([slug, id, routeName]) => {
      const name = routeName?.toString() ?? '';
      const isCurrentLocationLogPage = CURRENT_LOCATION_LOG_PAGES.has(name);

      if (isCurrentLocationLogPage && typeof slug === 'string' && typeof id === 'string') {
        void refreshCurrentLocationLog();
      }
    },
    { immediate: true },
  );

  watch(
    [
      locations,
      currentLocation,
      currentLocationLog,
      () => route.name,
      locationsStatus,
      currentLocationStatus,
      currentLocationLogStatus,
    ],
    () => {
      const routeName = route.name?.toString() || '';
      const isLocationPage = LOCATION_PAGES.has(routeName);
      const isCurrentLocationPage = CURRENT_LOCATION_PAGES.has(routeName);
      const isCurrentLocationLogPage = CURRENT_LOCATION_LOG_PAGES.has(routeName);
      const isLoading = (
        (isLocationPage && locationsStatus.value === 'pending')
        || (isCurrentLocationPage && currentLocationStatus.value === 'pending')
        || (isCurrentLocationLogPage && (
          currentLocationStatus.value === 'pending'
          || currentLocationLogStatus.value === 'pending'
        ))
      );

      sidebarStore.loading = isLoading;

      if (isLoading) {
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
      }
      else if (currentLocation.value && isCurrentLocationPage) {
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
      }
      else if (currentLocationLog.value && isCurrentLocationLogPage && currentLocation.value) {
        sidebarStore.sidebarItems = [];
        mapStore.mapPoints = [createMapPointFromLocationLog(
          currentLocationLog.value,
          currentLocation.value.slug,
        )];
      }
    },
    { immediate: true },
  );

  return {
    locations,
    locationsStatus,
    refreshLocations,

    currentLocation,
    currentLocationStatus,
    currentLocationError,
    refreshCurrentLocation,

    currentLocationLog,
    currentLocationLogStatus,
    currentLocationLogError,
    refreshCurrentLocationLog,
  };
});
