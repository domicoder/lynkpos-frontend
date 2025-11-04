import useAuthStore from '@/stores/user/AuthStore';
import type { AxiosError, AxiosResponse } from 'axios';
import router from '@/router';
import type { User, LoginToken } from '@/domains/User';

export const onResponse = (response: AxiosResponse): AxiosResponse => response;

export const onResponseError = async (
  error: AxiosError,
): Promise<AxiosError> => {
  const { response } = error;
  const authStore = useAuthStore();

  // [Refresh] Refresh Token
  // Logic

  // [Logout] Login for Logout
  if (response && response.status === 401) {
    authStore.setUserInfo({} as User);
    authStore.setToken({} as LoginToken);
    router.push({ name: 'login' });
  }

  return Promise.reject(error);
};
