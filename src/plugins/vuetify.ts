import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { getInitialTheme } from '@/utils/theme';
import { lightTheme } from '@/constants/theme';

const initialTheme = getInitialTheme();
const defaultTheme = initialTheme === lightTheme ? 'light' : 'dark';

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
    defaultTheme,
    themes: {
      light: {
        dark: false,
        colors: {
          'blue-dark': '#254567',
          'primary-accent': '#4880ff',
          'primary-accent-invert': '#e8e9ffd1',
          'gray-secondary': '#49475A',
          'bg-secondary': '#1A264A',
          'bg-secondary-dark': '#121212',
          'border-secondary': 'rgba(207, 207, 207, 0.1142)',
          'bg-primary-invert': '#212121',
        },
      },
      dark: {
        dark: true,
        colors: {
          'blue-dark': '#254567',
          'primary-accent': '#4880ff',
          'primary-accent-invert': '#4880ff',
          'gray-secondary': '#49475A',
          'bg-secondary': '#1A264A',
          'bg-secondary-dark': '#121212',
          'border-secondary': 'rgba(207, 207, 207, 0.1142)',
          'bg-primary-invert': '#f5f5f5',
        },
      },
    },
  },
});

export default vuetify;
