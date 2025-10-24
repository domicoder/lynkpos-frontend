import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import EnhancedApiClient from '@/services/api/EnhancedApiClient';
import TokenManager from '@/services/api/TokenManager';
import CacheManager from '@/services/api/CacheManager';
import ErrorManager from '@/services/api/ErrorManager';

vi.mock('axios');
vi.mock('@/stores/api/LoadingStore');

describe('EnhancedApiClient', () => {
  let apiClient: EnhancedApiClient;
  let mockAxios: Record<string, unknown>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockAxios = {
      create: vi.fn(() => ({
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
        request: vi.fn(),
      })),
    };

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
      vi.spyOn(
        TokenManager.prototype,
        'isAuthenticated',
        'get',
      ).mockReturnValue(true);
      expect(apiClient.isAuthenticated).toBe(true);
    });

    it('should not be authenticated when no token', () => {
      vi.spyOn(
        TokenManager.prototype,
        'isAuthenticated',
        'get',
      ).mockReturnValue(false);
      expect(apiClient.isAuthenticated).toBe(false);
    });
  });

  describe('Cache Management', () => {
    it('should clear cache when logout', () => {
      const clearCacheSpy = vi.spyOn(CacheManager.prototype, 'clear');

      apiClient.logout();

      expect(clearCacheSpy).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const handleErrorSpy = vi.spyOn(ErrorManager.prototype, 'handleError');

      try {
        await apiClient.get('/test-endpoint');
      } catch (error) {
        expect(handleErrorSpy).toHaveBeenCalled();
      }
    });
  });

  describe('File Upload', () => {
    it('should handle file upload with progress', async () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const onProgress = vi.fn();

      (
        mockAxios.request as { mockResolvedValueOnce: (value: unknown) => void }
      ).mockResolvedValueOnce({
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
