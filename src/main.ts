import { createApp } from 'vue';
import App from './App.vue';
import './main.scss';
import AppRouter from '@/router';
import AppI18n from './locales';
import AppStore from './stores';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { validateEnvironmentVariables } from '../scripts/env';

const app = createApp(App);

const vuetify = createVuetify({
  components,
  directives,
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
