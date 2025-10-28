export { default as ApiClient } from './EnhancedApiClient';

export { default as TokenManager } from './TokenManager';

export { default as CacheManager } from './CacheManager';

export { default as ValidationManager } from './ValidationManager';

export { default as ErrorManager } from './ErrorManager';

export type * from './types';

import EnhancedApiClient from './EnhancedApiClient';

export const api = EnhancedApiClient.getInstance();

export function setupApiClient() {
  const client = EnhancedApiClient.getInstance();

  return client;
}
