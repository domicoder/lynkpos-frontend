import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApi, useApiPost, useApiMutation } from '@/composables/useApi';

vi.mock('@/services/api/EnhancedApiClient', () => ({
  default: {
    getInstance: () => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    }),
  },
}));

describe('useApi Composable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useApi', () => {
    it('should return reactive data, loading, and error states', () => {
      const { data, loading, error, execute, reset } = useApi('/test-endpoint');

      expect(data.value).toBeNull();
      expect(loading.value).toBe(false);
      expect(error.value).toBeNull();
      expect(typeof execute).toBe('function');
      expect(typeof reset).toBe('function');
    });

    it('should execute immediately when immediate option is true', async () => {
      const mockApiClient = {
        get: vi.fn().mockResolvedValue({
          data: { test: 'data' },
          status: 200,
          message: 'OK',
          timestamp: new Date().toISOString(),
        }),
      };

      vi.doMock('@/services/api/EnhancedApiClient', () => ({
        default: {
          getInstance: () => mockApiClient,
        },
      }));

      const { execute } = useApi('/test-endpoint', { immediate: true });

      await execute();

      expect(mockApiClient.get).toHaveBeenCalledWith('/test-endpoint', {});
    });
  });

  describe('useApiPost', () => {
    it('should handle POST requests correctly', async () => {
      const mockApiClient = {
        post: vi.fn().mockResolvedValue({
          data: { success: true },
          status: 201,
          message: 'Created',
          timestamp: new Date().toISOString(),
        }),
      };

      vi.doMock('@/services/api/EnhancedApiClient', () => ({
        default: {
          getInstance: () => mockApiClient,
        },
      }));

      const { execute } = useApiPost('/test-endpoint');

      const testData = { name: 'Test' };

      await execute(testData);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/test-endpoint',
        testData,
        {},
      );
    });
  });

  describe('useApiMutation', () => {
    it('should handle different HTTP methods', async () => {
      const mockApiClient = {
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
      };

      vi.doMock('@/services/api/EnhancedApiClient', () => ({
        default: {
          getInstance: () => mockApiClient,
        },
      }));

      const { mutate } = useApiMutation();

      const testData = { name: 'Test' };

      // Test POST
      await mutate('/test', testData, 'POST');
      expect(mockApiClient.post).toHaveBeenCalledWith('/test', testData, {});

      // Test PUT
      await mutate('/test/1', testData, 'PUT');
      expect(mockApiClient.put).toHaveBeenCalledWith('/test/1', testData, {});

      // Test PATCH
      await mutate('/test/1', testData, 'PATCH');
      expect(mockApiClient.patch).toHaveBeenCalledWith('/test/1', testData, {});

      // Test DELETE
      await mutate('/test/1', undefined, 'DELETE');
      expect(mockApiClient.delete).toHaveBeenCalledWith('/test/1', {});
    });
  });
});
