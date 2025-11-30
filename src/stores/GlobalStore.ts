import type { I18nLanguage, Theme } from '@/constants/theme';
import { darkTheme, lightTheme } from '@/constants/theme';
import {
  changeDocumentTheme,
  getInitialLanguage,
  getInitialTheme,
  getLocalLanguage,
  setLocalLanguage,
  setPreferenceTheme,
} from '@/utils/theme';
import { defineStore } from 'pinia';

const useGlobalStore = defineStore('GlobalStore', {
  state: () => ({
    currentTheme: getInitialTheme(),
    currentLanguage: getInitialLanguage(),
    isConfirmModalOpen: false,
    confirmModalTitle: '',
    confirmModalMessage: '',
    handleConfirm: () => {},
    handleCancel: () => {},
  }),

  actions: {
    setTheme(theme: Theme, supported = false) {
      this.$state.currentTheme = theme;
      changeDocumentTheme(theme);
      if (supported) {
        setPreferenceTheme(theme);
      }
    },
    initDocumentTheme() {
      this.setTheme(this.currentTheme, true);
    },
    toggleTheme(supported = false) {
      const theme = this.currentTheme === lightTheme ? darkTheme : lightTheme;

      this.setTheme(theme, supported);
    },
    setLanguage(language: I18nLanguage) {
      setLocalLanguage(language);
      this.$state.currentLanguage = language;
    },
    setLocalLanguage() {
      this.$state.currentLanguage = getLocalLanguage();
    },
    setIsConfirmModalOpen(isConfirmModalOpen: boolean) {
      this.$state.isConfirmModalOpen = isConfirmModalOpen;
    },
    setConfirmModalTitle(confirmModalTitle: string) {
      this.$state.confirmModalTitle = confirmModalTitle;
    },
    setConfirmModalMessage(confirmModalMessage: string) {
      this.$state.confirmModalMessage = confirmModalMessage;
    },
    setHandleConfirm(handleConfirm: () => void) {
      this.$state.handleConfirm = handleConfirm;
    },
    setHandleCancel(handleCancel: () => void) {
      this.$state.handleCancel = handleCancel;
    },
    clearConfirmModal() {
      this.$state.isConfirmModalOpen = false;
      this.$state.confirmModalTitle = '';
      this.$state.confirmModalMessage = '';
      this.$state.handleConfirm = () => {};
      this.$state.handleCancel = () => {};
    },
  },
  getters: {
    getDocumentTheme: (state) => state.currentTheme,
    getDocumentLanguage: (state) => state.currentLanguage,
    getIsConfirmModalOpen: (state) => state.isConfirmModalOpen,
    getConfirmModalTitle: (state) => state.confirmModalTitle,
    getConfirmModalMessage: (state) => state.confirmModalMessage,
    getHandleConfirm: (state) => state.handleConfirm,
    getHandleCancel: (state) => state.handleCancel,
  },
});

export default useGlobalStore;
