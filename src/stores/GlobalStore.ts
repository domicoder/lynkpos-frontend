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
  },
  getters: {
    getDocumentTheme: (state) => state.currentTheme,
    getDocumentLanguage: (state) => state.currentLanguage,
  },
});

export default useGlobalStore;
