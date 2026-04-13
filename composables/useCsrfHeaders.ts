export function useCsrfHeaders() {
  const csrfToken = ref<string | undefined>(undefined);

  onMounted(async () => {
    const { token } = await $fetch<{ token: string }>('/api/csrf');
    csrfToken.value = token;
  });

  function getCsrfHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    if (csrfToken.value) {
      headers['x-csrf-token'] = csrfToken.value;
    }

    return headers;
  }

  return {
    getCsrfHeaders,
  };
}
