import HomeView from '@/views/home/HomeView.vue';
import LoginView from '@/views/login/LoginView.vue';
import AboutView from '@/views/about/AboutView.vue';
import PageNotFound from '@/views/not-found/PageNotFound.vue';
import {
  ABOUT_VIEW,
  HOME_VIEW,
  LOGIN_VIEW,
  PAGE_NOT_FOUND,
} from '@/router/paths';
import { Role } from '@/domains/Role';
import { loginBeforeEnter, requireAuth } from '@/services/auth';

const routes = [
  {
    ...LOGIN_VIEW,
    component: LoginView,
    beforeEnter: loginBeforeEnter,
    meta: {
      requiresAuth: false,
      rolesRequired: [Role.Admin, Role.User, Role.Guest],
    },
  },
  {
    ...HOME_VIEW,
    component: HomeView,
    beforeEnter: requireAuth,
    meta: {
      requiresAuth: true,
      rolesRequired: [Role.Admin, Role.User],
    },
  },
  {
    ...ABOUT_VIEW,
    component: AboutView,
    beforeEnter: requireAuth,
    meta: {
      requiresAuth: true,
      rolesRequired: [Role.Admin, Role.User],
    },
  },
  {
    ...PAGE_NOT_FOUND,
    component: PageNotFound,
    meta: {
      requiresAuth: false,
      rolesRequired: [Role.Admin, Role.User, Role.Guest],
    },
  },
];

export default routes;
