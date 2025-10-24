import {
  ABOUT_VIEW,
  HOME_VIEW,
  LOGIN_VIEW,
  PAGE_NOT_FOUND,
} from '@/router/paths';
import { Role } from '@/domains/Role';
import { loginBeforeEnter, requireAuth } from '@/services/auth';

// route lazy loading improvements
const LoginView = () => import('@/views/login/LoginView.vue');
const HomeView = () => import('@/views/home/HomeView.vue');
const AboutView = () => import('@/views/about/AboutView.vue');
const PageNotFound = () => import('@/views/not-found/PageNotFound.vue');

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
