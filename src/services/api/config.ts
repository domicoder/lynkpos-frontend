export interface ApiConfig {
  baseURL: string;
  timeout: number;
  cacheTTL: number;
  retryAttempts: number;
  retryDelay: number;
  enableLogging: boolean;
  enableMetrics: boolean;
}

const defaultConfig: ApiConfig = {
  baseURL:
    import.meta.env.VITE_API_URL ||
    `${window.location.protocol}//${window.location.host}/api`,
  timeout: parseInt(import.meta.env.VITE_APP_TIMEOUT || '30000'),
  cacheTTL: parseInt(import.meta.env.VITE_CACHE_TTL || '300000'),
  retryAttempts: 3,
  retryDelay: 1000,
  enableLogging: import.meta.env.DEV,
  enableMetrics: true,
};

const configs: Record<string, Partial<ApiConfig>> = {
  development: {
    enableLogging: true,
    enableMetrics: true,
  },
  production: {
    enableLogging: false,
    enableMetrics: true,
  },
  test: {
    baseURL: 'http://localhost:3000/api',
    timeout: 5000,
    enableLogging: false,
    enableMetrics: false,
  },
};

export function getApiConfig(): ApiConfig {
  const env = import.meta.env.MODE || 'development';
  const envConfig = configs[env] || {};

  return {
    ...defaultConfig,
    ...envConfig,
  };
}

export function updateApiConfig(updates: Partial<ApiConfig>): void {
  Object.assign(defaultConfig, updates);
}

export const endpointConfigs = {
  auth: {
    timeout: 10000,
    retryAttempts: 1,
  },
  upload: {
    timeout: 300000,
    retryAttempts: 2,
  },
  download: {
    timeout: 60000,
    retryAttempts: 3,
  },
  realtime: {
    timeout: 0,
    retryAttempts: 5,
  },
};

export function getEndpointConfig(endpoint: string): Partial<ApiConfig> {
  const path = endpoint.split('/')[1];

  switch (path) {
    case 'auth':
    case 'login':
    case 'logout':
    case 'register':
      return endpointConfigs.auth;
    case 'upload':
    case 'files':
      return endpointConfigs.upload;
    case 'download':
    case 'export':
      return endpointConfigs.download;
    case 'ws':
    case 'realtime':
    case 'notifications':
      return endpointConfigs.realtime;
    default:
      return {};
  }
}

export const validationConfig = {
  strictMode: import.meta.env.PROD,
  showWarnings: import.meta.env.DEV,
  logErrors: true,
};

export const cacheConfig = {
  defaultTTL: 5 * 60 * 1000,
  maxSize: 100,
  cleanupInterval: 5 * 60 * 1000,
  strategies: {
    users: { ttl: 10 * 60 * 1000 },
    settings: { ttl: 30 * 60 * 1000 },
    static: { ttl: 60 * 60 * 1000 },
  },
};

export const errorConfig = {
  maxErrors: 50,
  autoRetry: {
    enabled: true,
    maxAttempts: 3,
    delay: 1000,
    backoff: 2,
  },
  notifications: {
    enabled: true,
    duration: 5000,
    position: 'top-right',
  },
};

export const loadingConfig = {
  globalTimeout: 30000,
  showGlobalFor: ['POST', 'PUT', 'DELETE'],
  debounceDelay: 300,
};

export default {
  getApiConfig,
  updateApiConfig,
  getEndpointConfig,
  validationConfig,
  cacheConfig,
  errorConfig,
  loadingConfig,
};
