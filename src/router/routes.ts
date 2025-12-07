import {
  ABOUT_VIEW,
  CASH_REGISTERS_VIEW,
  HOME_VIEW,
  INVOICES_VIEW,
  LOGIN_VIEW,
  PAGE_NOT_FOUND,
  SALES_DASHBOARD_VIEW,
  USERS_VIEW,
} from '@/router/paths';
import { Role } from '@/domains/Role';
import { loginBeforeEnter, requireAuth } from '@/services/auth';

// route lazy loading improvements
const LoginView = () => import('@/views/login/LoginView.vue');
const HomeView = () => import('@/views/home/HomeView.vue');
const AboutView = () => import('@/views/about/AboutView.vue');
const UsersView = () => import('@/views/users/UsersView.vue');
const CashRegistersView = () =>
  import('@/views/cash-registers/CashRegisters.vue');
const PageNotFound = () => import('@/views/not-found/PageNotFound.vue');
const SalesDashboardView = () => import('@/views/sales/SalesDashboardView.vue');
const InvoicesView = () => import('@/views/invoices/InvoicesView.vue');

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
    ...USERS_VIEW,
    component: UsersView,
    beforeEnter: requireAuth,
    meta: {
      requiresAuth: true,
      rolesRequired: [Role.Admin, Role.User],
    },
  },
  {
    ...CASH_REGISTERS_VIEW,
    component: CashRegistersView,
    beforeEnter: requireAuth,
    meta: {
      requiresAuth: true,
      rolesRequired: [Role.Admin, Role.User],
    },
  },
  {
    ...SALES_DASHBOARD_VIEW,
    component: SalesDashboardView,
    beforeEnter: requireAuth,
    meta: {
      requiresAuth: true,
      rolesRequired: [Role.Admin, Role.User],
    },
  },
  {
    ...INVOICES_VIEW,
    component: InvoicesView,
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
