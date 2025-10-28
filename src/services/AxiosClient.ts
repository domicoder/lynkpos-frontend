/* eslint-disable no-console */
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import CSRF from '@/services/csrf';
import { onRequest, onRequestError } from '@/services/middlewares/request';
import { onResponse, onResponseError } from '@/services/middlewares/response';

class ApiService {
  private static session: AxiosInstance;
  private static init: boolean;

  private constructor() {
    const baseURL = `${window.location.protocol}//${window.location.host}/api`;

    ApiService.session = axios.create({
      baseURL,
      headers: {
        ...CSRF.getHeaders(),
      },
    });

    ApiService.session.interceptors.request.use(onRequest, onRequestError);
    ApiService.session.interceptors.response.use(onResponse, onResponseError);
  }

  static get instance(): AxiosInstance {
    if (!ApiService.init) {
      new ApiService();
      ApiService.init = true;
    }

    return ApiService.session;
  }

  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.get(url, config);

      return response.data;
    } catch (error) {
      console.error(`Error during GET request to ${url}:`, error);
      throw error;
    }
  }

  static async post<D, T>(
    url: string,
    data: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.post(
        url,
        data,
        config,
      );

      return response.data;
    } catch (error) {
      console.error(`Error during POST request to ${url}:`, error);
      throw error;
    }
  }

  static async put<D, T>(
    url: string,
    data: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.put(
        url,
        data,
        config,
      );

      return response.data;
    } catch (error) {
      console.error(`Error during PUT request to ${url}:`, error);
      throw error;
    }
  }

  static async patch<D, T>(
    url: string,
    data: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.patch(
        url,
        data,
        config,
      );

      return response.data;
    } catch (error) {
      console.error(`Error during PATCH request to ${url}:`, error);
      throw error;
    }
  }

  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.delete(
        url,
        config,
      );

      return response.data;
    } catch (error) {
      console.error(`Error during DELETE request to ${url}:`, error);
      throw error;
    }
  }
}

export default ApiService.instance;

export { ApiService };
