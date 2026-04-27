import { useMapStore } from '~/stores/map';
import type { MapPoint } from "~/lib/types";
import type { SelectLocation, SelectLocationWithLogs } from "~/lib/db/schema";
import { createMapPointFromLocation, createMapPointFromLocationLog } from '~/utils/mapPoints';
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
        watch: [() => route.params.slug],
      }
  )

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

        sidebarStore.loading =
            locationsStatus.value === 'pending' ||
            currentLocationStatus.value === 'pending';

        if (sidebarStore.loading) {
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
          const logs = currentLocation.value.locationLogs ?? [];

          const mapPoints: MapPoint[] = [];
          const sidebarItems: SidebarItem[] = [];

          logs.forEach((log) => {
            const mapPoint = createMapPointFromLocationLog(
                log,
                currentLocation.value!.slug
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
              : [createMapPointFromLocation(currentLocation.value)];

          return;
        }

        sidebarStore.sidebarItems = [];
        mapStore.mapPoints = [];
      },
      {
        immediate: true,
      }
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
