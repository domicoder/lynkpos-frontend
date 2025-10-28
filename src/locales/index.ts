import { createI18n } from 'vue-i18n';
import en from './en.locale.json';
import es from './es.locale.json';

const messages = {
  en,
  es,
};

const AppI18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  defaultScope: 'global',
});

export default AppI18n;

export const i18n = AppI18n.global;
