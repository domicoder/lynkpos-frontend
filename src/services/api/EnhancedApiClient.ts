import axios from 'axios';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import TokenManager from './TokenManager';
import CacheManager from './CacheManager';
import ValidationManager from './ValidationManager';
import ErrorManager from './ErrorManager';
import useLoadingStore from '@/stores/api/LoadingStore';
import type {
  ApiResponse,
  ApiRequestOptions,
  RequestConfig,
  UploadProgress,
} from './types';

class EnhancedApiClient {
  private static instance: EnhancedApiClient;
  private axiosInstance: AxiosInstance;
  private tokenManager: TokenManager;
  private cacheManager: CacheManager;
  private validationManager: ValidationManager;
  private errorManager: ErrorManager;
  private loadingStore = useLoadingStore();

  private constructor() {
    this.tokenManager = TokenManager.getInstance();
    this.cacheManager = CacheManager.getInstance();
    this.validationManager = ValidationManager.getInstance();
    this.errorManager = ErrorManager.getInstance();

    this.axiosInstance = axios.create({
      baseURL: this.getBaseURL(),
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.setupErrorHandlers();
    this.validationManager.registerCommonSchemas();
  }

  static getInstance(): EnhancedApiClient {
    if (!EnhancedApiClient.instance) {
      EnhancedApiClient.instance = new EnhancedApiClient();
    }

    return EnhancedApiClient.instance;
  }

  private getBaseURL(): string {
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }

    return `${window.location.protocol}//${window.location.host}/api`;
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await this.tokenManager.getValidAccessToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        const csrfToken = this.getCsrfToken();

        if (csrfToken) {
          config.headers['X-CSRFToken'] = csrfToken;
        }

        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
          config.timeout = 300000;
        }

        return config;
      },
      (error) => {
        return Promise.reject(
          this.errorManager.handleError(error, 'request_interceptor'),
        );
      },
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.tokenManager.getValidAccessToken();

            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;

              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            this.tokenManager.clearTokens();

            window.location.href = '/login';

            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(
          this.errorManager.handleError(error, 'response_interceptor'),
        );
      },
    );
  }

  private setupErrorHandlers(): void {
    this.errorManager.setupDefaultHandlers();
  }

  private getCsrfToken(): string | null {
    const meta = document.querySelector('meta[name="csrf-token"]');

    return meta ? meta.getAttribute('content') : null;
  }

  private generateCacheKey(
    method: string,
    url: string,
    config?: AxiosRequestConfig,
  ): string {
    return this.cacheManager.generateKey(method, url, config?.params);
  }

  private handleLoading(method: string, url: string, loading: boolean): void {
    const key = this.loadingStore.generateRequestKey(method, url);

    this.loadingStore.setRequestLoading(key, loading);
  }

  private async makeRequest<T>(
    options: ApiRequestOptions,
  ): Promise<ApiResponse<T>> {
    const {
      method,
      url,
      data,
      params,
      headers,
      cache = false,
      timeout,
      showGlobalLoading = false,
      validateData = false,
      onUploadProgress,
    } = options;

    if (showGlobalLoading) {
      this.loadingStore.setGlobalLoading(true);
    }
    this.handleLoading(method, url, true);

    try {
      if (method === 'GET' && cache) {
        const cacheKey = this.generateCacheKey(method, url, { params });
        const cachedData = this.cacheManager.get<ApiResponse<T>>(cacheKey);

        if (cachedData) {
          return cachedData;
        }
      }

      if (validateData && data) {
        // Validation logic would go here
      }

      const config: AxiosRequestConfig = {
        method,
        url,
        data,
        params,
        headers: { ...headers },
        timeout,
        onUploadProgress: onUploadProgress
          ? (progressEvent) => {
              const progress: UploadProgress = {
                loaded: progressEvent.loaded,
                total: progressEvent.total || 0,
                percentage: progressEvent.total
                  ? Math.round(
                      (progressEvent.loaded * 100) / progressEvent.total,
                    )
                  : 0,
              };

              onUploadProgress(progress);
            }
          : undefined,
      };

      const response = await this.axiosInstance.request<T>(config);

      const apiResponse: ApiResponse<T> = {
        data: response.data,
        status: response.status,
        message: response.statusText,
        timestamp: new Date().toISOString(),
      };

      if (method === 'GET' && cache) {
        const cacheKey = this.generateCacheKey(method, url, { params });

        this.cacheManager.set(cacheKey, apiResponse);
      }

      return apiResponse;
    } catch (error) {
      throw this.errorManager.handleError(error, `${method} ${url}`);
    } finally {
      this.handleLoading(method, url, false);
      if (showGlobalLoading) {
        this.loadingStore.setGlobalLoading(false);
      }
    }
  }

  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: 'GET',
      url,
      ...config,
    });
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: 'POST',
      url,
      data,
      ...config,
    });
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: 'PUT',
      url,
      data,
      ...config,
    });
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: 'PATCH',
      url,
      data,
      ...config,
    });
  }

  async delete<T>(
    url: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: 'DELETE',
      url,
      ...config,
    });
  }

  async uploadFile<T>(
    url: string,
    file: File,
    additionalData?: Record<string, unknown>,
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();

    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(
          key,
          typeof value === 'string' ? value : JSON.stringify(value),
        );
      });
    }

    return this.makeRequest<T>({
      method: 'POST',
      url,
      data: formData,
      timeout: 300000, // 5 minutos
      onUploadProgress: onProgress,
      showGlobalLoading: true,
    });
  }

  async uploadMultipleFiles<T>(
    url: string,
    files: File[],
    additionalData?: Record<string, unknown>,
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(
          key,
          typeof value === 'string' ? value : JSON.stringify(value),
        );
      });
    }

    return this.makeRequest<T>({
      method: 'POST',
      url,
      data: formData,
      timeout: 600000, // 10 minutos para múltiples archivos
      onUploadProgress: onProgress,
      showGlobalLoading: true,
    });
  }

  clearCache(): void {
    this.cacheManager.clear();
  }

  invalidateCache(pattern: string): void {
    this.cacheManager.invalidatePattern(pattern);
  }

  logout(): void {
    this.clearAuthTokens();
    this.cacheManager.clear();
    this.loadingStore.clearAllLoading();
  }

  get isAuthenticated(): boolean {
    return this.tokenManager.isAuthenticated;
  }

  get loadingState() {
    return this.loadingStore;
  }

  get errorState() {
    return this.errorManager;
  }

  async getValidAccessToken(): Promise<string | null> {
    return this.tokenManager.getValidAccessToken();
  }

  setAuthTokens(
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
  ): void {
    this.tokenManager.setTokens({
      accessToken,
      refreshToken,
      expiresAt: Date.now() + expiresIn * 1000,
    });
  }

  clearAuthTokens(): void {
    this.tokenManager.clearTokens();
  }
}

export default EnhancedApiClient;
