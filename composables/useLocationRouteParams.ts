function routeParamToString(param: unknown) {
  if (Array.isArray(param)) {
    return String(param[0] ?? '');
  }

  return String(param ?? '');
}

export function useLocationRouteParams() {
  const route = useRoute();

  const slug = computed(() => routeParamToString(route.params.slug));
  const id = computed(() => routeParamToString(route.params.id));

  function locationRoute() {
    return {
      name: 'dashboard-location-slug',
      params: { slug: slug.value },
    };
  }

  function locationLogRoute() {
    return {
      name: 'dashboard-location-slug-id',
      params: {
        slug: slug.value,
        id: id.value,
      },
    };
  }

  function navigateToLocation() {
    void navigateTo(locationRoute());
  }

  function navigateToLocationLog() {
    void navigateTo(locationLogRoute());
  }

  return {
    slug,
    id,
    locationRoute,
    locationLogRoute,
    navigateToLocation,
    navigateToLocationLog,
  };
}
