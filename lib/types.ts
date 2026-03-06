import type { UserWithId } from '~/lib/auth';

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
