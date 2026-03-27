import type { SelectLocation } from "~/lib/db/schema";
import type { MapPoint } from "~/lib/types";

export function createMapPointFromLocation(location: SelectLocation): MapPoint {
    return {
        ...location,
        to: { name: 'dashboard-location-slug', params: { slug: location.slug }},
        toLabel: 'View Location',
    }
}
