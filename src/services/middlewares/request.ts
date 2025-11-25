import useAuthStore from '@/stores/user/AuthStore';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const onRequest = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const authStore = useAuthStore();
  const token = authStore.getToken;

  if (authStore.isLoggedIn && token) {
    config.headers!.Authorization = `Bearer ${token}`;
  }

  return config;
};

export const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};
