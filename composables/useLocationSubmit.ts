import type {FetchError} from 'ofetch';

type LocationSubmitMethod = 'post' | 'put';
type CsrfHeadersGetter = () => Record<string, string>;

export function useLocationSubmit(getCsrfHeaders: CsrfHeadersGetter) {
  async function submitLocation<T extends Record<string, unknown>>(url: string, method: LocationSubmitMethod, values: T) {
    try {
      await $fetch(url, {
        method,
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          ...getCsrfHeaders(),
        },
        body: values,
      });
    }
    catch (e) {
      throw e as FetchError;
    }
  }

  return {
    submitLocation,
  };
}
