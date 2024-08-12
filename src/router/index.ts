import { createRouter, createWebHistory } from 'vue-router';
import routes from '@/router/routes';

const AppRouter = createRouter({
  history: createWebHistory(),
  routes: routes,
  linkActiveClass: 'active-link',
  linkExactActiveClass: 'exact-active-link',
});

export default AppRouter;
