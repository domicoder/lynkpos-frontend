import { createApp } from 'vue';
import App from './App.vue';
import './main.scss';
import AppRouter from '@/router';
import AppI18n from './locales';
import AppStore from './stores';

// Vuetify
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { validateEnvironmentVariables } from '../scripts/env';

const app = createApp(App);

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          'blue-dark': '#254567',
          'gray-secondary': '49475A',
        },
      },
    },
  },
});

if (import.meta.env.VITE_ENV == 'development') {
  validateEnvironmentVariables();
}

// Add more global
app.use(AppI18n);
app.use(AppRouter);
app.use(AppStore);
app.use(vuetify);

app.mount('#app');
