// no external types needed here after ensuring we throw Error objects

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
      if (e instanceof Error) {
        throw e;
      }
      throw new Error(String(e));
    }
  }

  return {
    submitLocation,
  };
}
