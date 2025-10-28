import { createApp } from 'vue';
import App from './App.vue';
import './main.scss';
import AppRouter from '@/router';
import AppI18n from './locales';
import AppStore from './stores';

import { validateEnvironmentVariables } from '../scripts/env';

const app = createApp(App);

if (import.meta.env.VITE_ENV == 'development') {
  validateEnvironmentVariables();
}

// Add more global
app.use(AppI18n);
app.use(AppRouter);
app.use(AppStore);

app.mount('#app');
