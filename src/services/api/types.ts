/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: Remove all any and put the correct types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
  timestamp: string;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}

export interface RequestConfig {
  cache?: boolean;
  timeout?: number;
  retries?: number;
  validateData?: boolean;
  showGlobalLoading?: boolean;
}

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions extends RequestConfig {
  method: RequestMethod;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  onUploadProgress?: (progress: UploadProgress) => void;
}
