import type { UserWithId } from '~/lib/auth';

declare module 'h3' {
  // @ts-ignore
  type H3EventContext = {
    user?: UserWithId;
  };
}

export type LatLongItem = {
  lat: number;
  long: number;
};

export type MapPoint = {
  id: number;
  label: string;
} & LatLongItem;
