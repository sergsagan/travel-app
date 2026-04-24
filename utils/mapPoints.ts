import type { SelectLocation, SelectLocationLog } from "~/lib/db/schema";
import type { MapPoint } from "~/lib/types";

export function createMapPointFromLocation(location: SelectLocation): MapPoint {
    return {
        ...location,
        to: { name: 'dashboard-location-slug', params: { slug: location.slug }},
        toLabel: 'View Location',
    }
}

export function createMapPointFromLocationLog(locationLog: SelectLocationLog, parentSlug?: string): MapPoint {
    const to = parentSlug
        ? { name: 'dashboard-location-slug-id', params: { slug: parentSlug, id: locationLog.id } }
        : undefined;

    return {
        ...locationLog,
        to,
        toLabel: 'View Location Log',
    }
}
