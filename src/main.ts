import { createApp } from 'vue';
import App from './App.vue';
import './main.scss';
import AppRouter from '@/router';
import AppI18n from './locales';
import AppStore from './stores';
import vuetify from '@/plugins/vuetify';
import ECharts from '@/plugins/echarts';

import { validateEnvironmentVariables } from '../scripts/env';

const app = createApp(App);

if (import.meta.env.VITE_ENV == 'development') {
  validateEnvironmentVariables();
}

// Add more global
app.use(AppI18n);
app.use(AppRouter);
app.use(AppStore);
app.use(vuetify);

// Register ECharts component
app.component('v-chart', ECharts);

app.mount('#app');
