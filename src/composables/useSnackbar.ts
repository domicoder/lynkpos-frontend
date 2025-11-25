import { computed, ref } from 'vue';
import { useSnackbarStore } from '@/stores/SnackbarStore';
import type { SnackbarColor } from '@/stores/SnackbarStore';
import { useI18n } from 'vue-i18n';

/**
 * Composable for using the global snackbar
 * This provides a convenient API for showing notifications
 */
export function useSnackbar() {
  const snackbarStore = useSnackbarStore();
  const { t } = useI18n();
  const error = ref<string | null>(null);

  const showSnackbar = (
    message: string,
    color: SnackbarColor = 'success',
    timeout = 3000,
  ) => {
    snackbarStore.showSnackbar(message, color, timeout);
  };

  const showSuccess = (message: string, timeout = 3000) => {
    snackbarStore.showSuccess(message, timeout);
  };

  const showError = (message: string, timeout = 3000) => {
    error.value = message;
    snackbarStore.showError(message, timeout);
  };

  const showWarning = (message: string, timeout = 3000) => {
    snackbarStore.showWarning(message, timeout);
  };

  const showInfo = (message: string, timeout = 3000) => {
    snackbarStore.showInfo(message, timeout);
  };

  const hideSnackbar = () => {
    snackbarStore.hide();
  };

  const showGlobalLoading = (
    message: string = t('loading.generalMessageLoading'),
    isLoader = false,
  ) => {
    snackbarStore.showSnackbar(message, 'primary-accent', -1, isLoader);
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    // Methods
    showSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideSnackbar,
    clearError,
    showGlobalLoading,

    // State
    error,
    hasError: computed(() => !!error.value),

    // Store getters (for direct access if needed)
    isVisible: computed(() => snackbarStore.isVisible),
    message: computed(() => snackbarStore.getMessage),
    color: computed(() => snackbarStore.getColor),
    timeout: computed(() => snackbarStore.getTimeout),
  };
}
