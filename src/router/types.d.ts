import type { Role } from '@/domains/Role';
import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean;
    rolesRequired?: Role[];
  }
}
