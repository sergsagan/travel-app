import type { UserWithId } from '~/lib/auth';
import type {RouteLocationRaw} from "vue-router";
import type { ZodType } from "zod";

declare module 'h3' {
  interface H3EventContext {
    user?: UserWithId;
  }
}

export type LatLongItem = {
  lat: number;
  long: number;
};

export type MapPoint = {
  id: number;
  name: string;
  description: string | null;
  to?: RouteLocationRaw;
  toLabel?: string;
} & LatLongItem;

export type NominatimResult = {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    class: string;
    type: string;
    importance: number;
    place_rank: number;
    addresstype: string;
    name: string;
    display_name: string;
    boundingbox: string[];
}

export type FormValues = {
    name: string
    description?: string
    lat: number
    long: number
}
