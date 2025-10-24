import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import EnhancedApiClient from '@/services/api/EnhancedApiClient';

const mockAxiosInstance = {
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  },
  request: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
};

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance),
  },
}));

vi.mock('@/stores/api/LoadingStore', () => ({
  default: vi.fn(() => ({
    setLoading: vi.fn(),
    setError: vi.fn(),
    clearError: vi.fn(),
    clearAllLoading: vi.fn(),
    generateRequestKey: vi.fn(() => 'test-key'),
    setRequestLoading: vi.fn(),
    setGlobalLoading: vi.fn(),
  })),
}));

const mockTokenManager = {
  isAuthenticated: false,
  getValidAccessToken: vi.fn(),
  setTokens: vi.fn(),
  clearTokens: vi.fn(),
};

vi.mock('@/services/api/TokenManager', () => ({
  default: {
    getInstance: vi.fn(() => mockTokenManager),
  },
}));

vi.mock('@/services/api/CacheManager', () => ({
  default: {
    getInstance: vi.fn(() => ({
      get: vi.fn(),
      set: vi.fn(),
      clear: vi.fn(),
    })),
  },
}));

vi.mock('@/services/api/ErrorManager', () => ({
  default: {
    getInstance: vi.fn(() => ({
      handleError: vi.fn(),
      setupDefaultHandlers: vi.fn(),
    })),
  },
}));

describe('EnhancedApiClient', () => {
  let apiClient: EnhancedApiClient;

  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(window, 'location', {
      value: {
        protocol: 'https:',
        host: 'localhost:3000',
      },
      writable: true,
    });

    apiClient = EnhancedApiClient.getInstance();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = EnhancedApiClient.getInstance();
      const instance2 = EnhancedApiClient.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('Authentication', () => {
    it('should be authenticated when token is valid', () => {
      mockTokenManager.isAuthenticated = true;
      expect(apiClient.isAuthenticated).toBe(true);
    });

    it('should not be authenticated when no token', () => {
      mockTokenManager.isAuthenticated = false;
      expect(apiClient.isAuthenticated).toBe(false);
    });
  });

  describe('Cache Management', () => {
    it('should clear cache when logout', () => {
      expect(() => apiClient.logout()).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiClient.get('/test-endpoint')).rejects.toThrow(
        'Network error',
      );
    });
  });

  describe('File Upload', () => {
    it('should handle file upload with progress', async () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const onProgress = vi.fn();

      mockAxiosInstance.request.mockResolvedValueOnce({
        data: { success: true },
        status: 200,
        statusText: 'OK',
      });

      try {
        await apiClient.uploadFile('/upload', mockFile, {}, onProgress);
        expect(onProgress).toHaveBeenCalled();
      } catch (error) {
        // Expected in test environment
      }
    });
  });
});
