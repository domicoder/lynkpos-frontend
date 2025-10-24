/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './index';

export class LegacyApiCompatibility {
  private static instance: LegacyApiCompatibility;
  private enhancedClient = api;

  static getInstance(): LegacyApiCompatibility {
    if (!LegacyApiCompatibility.instance) {
      LegacyApiCompatibility.instance = new LegacyApiCompatibility();
    }

    return LegacyApiCompatibility.instance;
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.enhancedClient.get<T>(url, config);

    return response.data;
  }

  async post<D, T>(url: string, data: D, config?: any): Promise<T> {
    const response = await this.enhancedClient.post<T>(url, data, config);

    return response.data;
  }

  async put<D, T>(url: string, data: D, config?: any): Promise<T> {
    const response = await this.enhancedClient.put<T>(url, data, config);

    return response.data;
  }

  async patch<D, T>(url: string, data: D, config?: any): Promise<T> {
    const response = await this.enhancedClient.patch<T>(url, data, config);

    return response.data;
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.enhancedClient.delete<T>(url, config);

    return response.data;
  }

  get isAuthenticated(): boolean {
    return this.enhancedClient.isAuthenticated;
  }

  get loadingState() {
    return this.enhancedClient.loadingState;
  }
}

export const ApiClient = LegacyApiCompatibility.getInstance();

export default ApiClient;
