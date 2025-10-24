import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useApiPost, useApiMutation } from '../useApi';
import { api } from '@/services/api';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

const RegisterSchema = z
  .object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    name: z.string().min(2, 'Name must be at least 2 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  roles?: string[];
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export function useAuth() {
  const router = useRouter();
  const user = ref<AuthUser | null>(null);

  const {
    loading: loginLoading,
    error: loginError,
    execute: performLogin,
  } = useApiPost<LoginCredentials, AuthResponse>('/auth/login', {
    validateData: true,
    onSuccess: (response) => {
      handleAuthSuccess(response);
    },
  });

  const {
    loading: registerLoading,
    error: registerError,
    mutate: performRegister,
  } = useApiMutation<RegisterData, AuthResponse>({
    validateData: true,
    onSuccess: (response) => {
      handleAuthSuccess(response);
    },
  });

  const { loading: logoutLoading, mutate: performLogout } = useApiMutation({
    onSuccess: () => {
      handleLogout();
    },
  });

  const isAuthenticated = computed(() => api.isAuthenticated && !!user.value);
  const isLoading = computed(
    () => loginLoading.value || registerLoading.value || logoutLoading.value,
  );

  const login = async (credentials: LoginCredentials) => {
    try {
      LoginSchema.parse(credentials);

      return await performLogin(credentials);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Datos inválidos: ${error.errors.map((e) => e.message).join(', ')}`,
        );
      }
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      RegisterSchema.parse(data);

      return await performRegister('/auth/register', data, 'POST');
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Datos inválidos: ${error.errors.map((e) => e.message).join(', ')}`,
        );
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await performLogout('/auth/logout', undefined, 'POST');
    } catch (error) {
      handleLogout();
    }
  };

  const refreshToken = async () => {
    try {
      const token = await api.getValidAccessToken();

      return !!token;
    } catch {
      handleLogout();

      return false;
    }
  };

  const getCurrentUser = async () => {
    if (!api.isAuthenticated) return null;

    try {
      const response = await api.get<AuthUser>('/auth/me', { cache: true });

      user.value = response.data;

      return response.data;
    } catch (error) {
      handleLogout();

      return null;
    }
  };

  const handleAuthSuccess = (response: AuthResponse) => {
    user.value = response.user;
    api.setAuthTokens(
      response.accessToken,
      response.refreshToken,
      response.expiresIn,
    );

    const redirect = router.currentRoute.value.query.redirect as string;

    router.push(redirect || '/dashboard');
  };

  const handleLogout = () => {
    user.value = null;
    api.clearAuthTokens();
    router.push('/login');
  };

  const hasRole = (role: string): boolean => {
    return user.value?.roles?.includes(role) ?? false;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some((role) => hasRole(role));
  };

  const hasAllRoles = (roles: string[]): boolean => {
    return roles.every((role) => hasRole(role));
  };

  const initialize = async () => {
    if (api.isAuthenticated) {
      await getCurrentUser();
    }
  };

  return {
    user: computed(() => user.value),
    isAuthenticated,
    isLoading,
    loginError,
    registerError,
    login,
    register,
    logout,
    refreshToken,
    getCurrentUser,
    initialize,
    hasRole,
    hasAnyRole,
    hasAllRoles,
  };
}

export function useAuthGuard() {
  const { isAuthenticated, getCurrentUser } = useAuth();

  const requireAuth = async () => {
    if (!isAuthenticated.value) {
      throw new Error('Authentication required');
    }

    const user = await getCurrentUser();

    if (!user) {
      throw new Error('Invalid user session');
    }

    return user;
  };

  const requireRole = async (role: string) => {
    const user = await requireAuth();

    if (!user.roles?.includes(role)) {
      throw new Error(`Role '${role}' required`);
    }

    return user;
  };

  const requireAnyRole = async (roles: string[]) => {
    const user = await requireAuth();

    if (!roles.some((role) => user.roles?.includes(role))) {
      throw new Error(`One of roles ${roles.join(', ')} required`);
    }

    return user;
  };

  return {
    requireAuth,
    requireRole,
    requireAnyRole,
  };
}
