import { defineStore } from 'pinia';

export type SnackbarColor =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'primary-accent';

export interface SnackbarState {
  show: boolean;
  message: string;
  color: SnackbarColor;
  timeout: number;
  isLoader?: boolean;
}

export const useSnackbarStore = defineStore('SnackbarStore', {
  state: (): SnackbarState => ({
    show: false,
    message: '',
    color: 'success',
    timeout: 3000,
    isLoader: false,
  }),

  actions: {
    setIsLoader(isLoader: boolean) {
      this.isLoader = isLoader;
    },

    showSnackbar(
      message: string,
      color: SnackbarColor = 'success',
      timeout = 3000,
      isLoader = false,
    ) {
      this.message = message;
      this.color = color;
      this.timeout = timeout;
      this.show = true;
      this.isLoader = isLoader;
    },

    showSuccess(message: string, timeout = 3000) {
      this.showSnackbar(message, 'success', timeout);
    },

    showError(message: string, timeout = 3000) {
      this.showSnackbar(message, 'error', timeout);
    },

    showWarning(message: string, timeout = 3000) {
      this.showSnackbar(message, 'warning', timeout);
    },

    showInfo(message: string, timeout = 3000) {
      this.showSnackbar(message, 'info', timeout);
    },

    hide() {
      this.show = false;
    },

    clear() {
      this.show = false;
      this.message = '';
      this.color = 'success';
      this.timeout = 3000;
    },
  },

  getters: {
    isVisible: (state) => state.show,
    getMessage: (state) => state.message,
    getColor: (state) => state.color,
    getTimeout: (state) => state.timeout,
    getIsLoader: (state) => state.isLoader,
  },
});

export default useSnackbarStore;
