import { Role as R } from '@/domains/Role';
import type { Role as UserRole } from '@/domains/User';
import { LOGIN_VIEW, PAGE_NOT_FOUND } from '@/router/paths';
import useAuthStore from '@/stores/user/AuthStore';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

// TODO: handle required roles
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const hasRequiredRoles = (userRoles: UserRole[], accessRoles: R[]) => {
  const draft = userRoles.map((g) => g.role_name);

  if (accessRoles.includes(R.Admin) && accessRoles.includes(R.User)) {
    return draft.includes(R.Admin) || draft.includes(R.User);
  }

  return accessRoles.every((role) => draft.includes(role));
};

export function requireAuth(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const userStore = useAuthStore();

  if (!userStore.isLoggedIn) {
    next({
      name: LOGIN_VIEW.name,
      query: { redirect: to.fullPath },
    });
  } else {
    // TODO: clean this code (handle required roles)
    // const requiresAuth = to.meta.requiresAuth;

    // const userRoles = (userStore.user?.roles as UserRole[]) || [];
    // const requiresRoles = (to.meta.rolesRequired as R[]) || [];

    // const hasRequiredRole = hasRequiredRoles(userRoles, requiresRoles);

    next();
    // if (hasRequiredRole && requiresAuth) {
    // } else {
    //   next({
    //     name: PAGE_NOT_FOUND.name,
    //   });
    // }
  }
}

export function loginBeforeEnter(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const userStore = useAuthStore();

  if (!userStore.isLoggedIn) {
    next();
  } else {
    next({
      name: PAGE_NOT_FOUND.name,
    });
  }
}
