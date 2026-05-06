import type { FetchError } from 'ofetch';
import type { RouteLocationRaw } from 'vue-router';

type UseConfirmDeleteOptions = {
  endpoint: () => string;
  redirectTo: () => RouteLocationRaw;
};

export function useConfirmDelete(options: UseConfirmDeleteOptions) {
  const { getCsrfHeaders } = useCsrfHeaders();

  const isOpen = ref(false);
  const deleteError = ref('');
  const isDeleting = ref(false);

  function openDialog() {
    isOpen.value = true;
    (document.activeElement as HTMLElement | null)?.blur();
  }

  async function confirmDelete() {
    try {
      isOpen.value = false;
      deleteError.value = '';
      isDeleting.value = true;

      await $fetch(options.endpoint(), {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
          ...getCsrfHeaders(),
        },
      });

      await navigateTo(options.redirectTo());
    }
    catch (e) {
      const error = e as FetchError;
      deleteError.value = getFetchErrorMessage(error);
    }
    finally {
      isDeleting.value = false;
    }
  }

  return {
    isOpen,
    deleteError,
    isDeleting,
    openDialog,
    confirmDelete,
  };
}
