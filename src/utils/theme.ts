import type { I18nLanguage, Theme } from '@/constants/theme';
import {
  darkTheme,
  LANGUAGE_APP_KEY,
  lightTheme,
  THEME_KEY,
} from '@/constants/theme';

export function getUserPreferenceTheme() {
  const colorScheme = '(prefers-color-scheme: dark)';
  const hasDarkPreference = window.matchMedia(colorScheme).matches;

  return hasDarkPreference ? darkTheme : lightTheme;
}

export function getPreferenceTheme() {
  return localStorage.getItem(THEME_KEY) as Theme;
}

export function setPreferenceTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme);
}

export function getInitialTheme() {
  const storedTheme = getPreferenceTheme();
  const theme = storedTheme || getUserPreferenceTheme();

  return theme;
}

export function changeDocumentTheme(theme: Theme) {
  document.documentElement.className = theme;
}

export function getLocalLanguage() {
  return localStorage.getItem(LANGUAGE_APP_KEY) as I18nLanguage;
}

export function setLocalLanguage(lang: I18nLanguage) {
  localStorage.setItem(LANGUAGE_APP_KEY, lang);
}

export function getInitialLanguage() {
  const storedLanguage = getLocalLanguage();
  const language = storedLanguage || 'es';

  return language;
}
