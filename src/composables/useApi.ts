/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, computed, unref } from 'vue';
import type { Ref, MaybeRef } from 'vue';
import EnhancedApiClient from '@/services/api/EnhancedApiClient';
import type { ApiResponse, RequestConfig } from '@/services/api/types';

export interface UseApiOptions<T> extends RequestConfig {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  transform?: (data: any) => T;
}

export interface UseApiReturn<T> {
  data: Ref<T | null>;
  loading: Ref<boolean>;
  error: Ref<any>;
  execute: () => Promise<void>;
  reset: () => void;
}

export function useApi<T = any>(
  url: MaybeRef<string>,
  options: UseApiOptions<T> = {},
): UseApiReturn<T> {
  const apiClient = EnhancedApiClient.getInstance();

  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<any>(null);

  const {
    immediate = false,
    onSuccess,
    onError,
    transform,
    ...requestConfig
  } = options;

  const execute = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response: ApiResponse<T> = await apiClient.get(
        unref(url),
        requestConfig,
      );
      let result = response.data;

      if (transform) {
        result = transform(result);
      }

      data.value = result;
      onSuccess?.(result);
    } catch (err) {
      error.value = err;
      onError?.(err);
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    data.value = null;
    loading.value = false;
    error.value = null;
  };

  if (immediate) {
    execute();
  }

  return {
    data: data as Ref<T | null>,
    loading,
    error,
    execute,
    reset,
  };
}

export function useApiPost<TData = any, TResponse = any>(
  url: MaybeRef<string>,
  options: UseApiOptions<TResponse> = {},
) {
  const apiClient = EnhancedApiClient.getInstance();

  const data = ref<TResponse | null>(null);
  const loading = ref(false);
  const error = ref<any>(null);

  const { onSuccess, onError, transform, ...requestConfig } = options;

  const execute = async (payload?: TData) => {
    loading.value = true;
    error.value = null;

    try {
      const response: ApiResponse<TResponse> = await apiClient.post(
        unref(url),
        payload,
        requestConfig,
      );

      let result = response.data;

      if (transform) {
        result = transform(result);
      }

      data.value = result;
      onSuccess?.(result);

      return result;
    } catch (err) {
      error.value = err;
      onError?.(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    data.value = null;
    loading.value = false;
    error.value = null;
  };

  return {
    data: data as Ref<TResponse | null>,
    loading,
    error,
    execute,
    reset,
  };
}

export function useApiMutation<TData = any, TResponse = any>(
  options: UseApiOptions<TResponse> = {},
) {
  const apiClient = EnhancedApiClient.getInstance();

  const data = ref<TResponse | null>(null);
  const loading = ref(false);
  const error = ref<any>(null);

  const { onSuccess, onError, transform, ...requestConfig } = options;

  const mutate = async (
    url: string,
    payload?: TData,
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  ) => {
    loading.value = true;
    error.value = null;

    try {
      let response: ApiResponse<TResponse>;

      switch (method) {
        case 'POST':
          response = await apiClient.post(url, payload, requestConfig);
          break;
        case 'PUT':
          response = await apiClient.put(url, payload, requestConfig);
          break;
        case 'PATCH':
          response = await apiClient.patch(url, payload, requestConfig);
          break;
        case 'DELETE':
          response = await apiClient.delete(url, requestConfig);
          break;
      }

      let result = response.data;

      if (transform) {
        result = transform(result);
      }

      data.value = result;
      onSuccess?.(result);

      return result;
    } catch (err) {
      error.value = err;
      onError?.(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    data.value = null;
    loading.value = false;
    error.value = null;
  };

  return {
    data: data as Ref<TResponse | null>,
    loading,
    error,
    mutate,
    reset,
  };
}

export function useApiPagination<T = any>(
  baseUrl: MaybeRef<string>,
  options: UseApiOptions<T> & {
    pageSize?: number;
    initialPage?: number;
  } = {},
) {
  const { pageSize = 20, initialPage = 1, ...apiOptions } = options;

  const currentPage = ref(initialPage);
  const totalPages = ref(0);
  const totalItems = ref(0);
  const items = ref<T[]>([]);

  const url = computed(() => {
    const base = unref(baseUrl);

    return `${base}?page=${currentPage.value}&limit=${pageSize}`;
  });

  const { loading, error, execute } = useApi(url, {
    ...apiOptions,
    onSuccess: (response: any) => {
      items.value = response.items || response.data || [];
      totalPages.value =
        response.totalPages || Math.ceil(response.total / pageSize);
      totalItems.value = response.total || response.count || 0;
      apiOptions.onSuccess?.(response);
    },
  });

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
      execute();
    }
  };

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
      execute();
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      execute();
    }
  };

  const hasNext = computed(() => currentPage.value < totalPages.value);
  const hasPrev = computed(() => currentPage.value > 1);

  return {
    items,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    goToPage,
    refresh: execute,
  };
}

export function useFileUpload<T = any>(
  url: MaybeRef<string>,
  options: UseApiOptions<T> = {},
) {
  const apiClient = EnhancedApiClient.getInstance();

  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<any>(null);
  const progress = ref(0);

  const { onSuccess, onError, transform } = options;

  const upload = async (file: File, additionalData?: Record<string, any>) => {
    loading.value = true;
    error.value = null;
    progress.value = 0;

    try {
      const response = await apiClient.uploadFile<T>(
        unref(url),
        file,
        additionalData,
        (uploadProgress) => {
          progress.value = uploadProgress.percentage;
        },
      );

      let result = response.data;

      if (transform) {
        result = transform(result);
      }

      data.value = result;
      onSuccess?.(result);

      return result;
    } catch (err) {
      error.value = err;
      onError?.(err);
      throw err;
    } finally {
      loading.value = false;
      progress.value = 0;
    }
  };

  const uploadMultiple = async (
    files: File[],
    additionalData?: Record<string, any>,
  ) => {
    loading.value = true;
    error.value = null;
    progress.value = 0;

    try {
      const response = await apiClient.uploadMultipleFiles<T>(
        unref(url),
        files,
        additionalData,
        (uploadProgress) => {
          progress.value = uploadProgress.percentage;
        },
      );

      let result = response.data;

      if (transform) {
        result = transform(result);
      }

      data.value = result;
      onSuccess?.(result);

      return result;
    } catch (err) {
      error.value = err;
      onError?.(err);
      throw err;
    } finally {
      loading.value = false;
      progress.value = 0;
    }
  };

  const reset = () => {
    data.value = null;
    loading.value = false;
    error.value = null;
    progress.value = 0;
  };

  return {
    data: data as Ref<T | null>,
    loading,
    error,
    progress,
    upload,
    uploadMultiple,
    reset,
  };
}

export default {
  useApi,
  useApiPost,
  useApiMutation,
  useApiPagination,
  useFileUpload,
};
