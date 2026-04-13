import type { FetchError } from 'ofetch';
import type { InsertLocation } from '~/lib/db/schema';

type LocationSubmitMethod = 'post' | 'put';
type CsrfHeadersGetter = () => Record<string, string>;

export function useLocationSubmit(getCsrfHeaders: CsrfHeadersGetter) {
  async function submitLocation(url: string, method: LocationSubmitMethod, values: InsertLocation) {
    try {
      await $fetch(url, {
        method,
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          ...getCsrfHeaders(),
        },
        body: JSON.stringify(values),
      });
    }
    catch (e) {
      const error = e as FetchError;
      console.error(error);
    }
  }

  return {
    submitLocation,
  };
}
