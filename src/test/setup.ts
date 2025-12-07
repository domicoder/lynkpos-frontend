/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from '@vue/test-utils';
import { vi } from 'vitest';

// Create a proper localStorage mock that works with jsdom
const createStorageMock = () => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string): string | null => {
      return store[key] || null;
    },
    setItem: (key: string, value: string): void => {
      store[key] = value.toString();
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
    get length(): number {
      return Object.keys(store).length;
    },
    key: (index: number): string | null => {
      const keys = Object.keys(store);

      return keys[index] || null;
    },
  };
};

// Since we're using jsdom environment, localStorage and sessionStorage should be available
// But we'll ensure they're properly set up with a working implementation
if (typeof window !== 'undefined') {
  // Always ensure localStorage is available and working
  const localStorageMock = createStorageMock();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });

  // Always ensure sessionStorage is available and working
  const sessionStorageMock = createStorageMock();

  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
    writable: true,
    configurable: true,
  });

  // jsdom already provides window.location with all necessary properties
  // We don't need to modify it here - it will be available for tests
  // Individual tests can mock window.location.href if needed

  // Mock document for CSRF token queries
  if (typeof document !== 'undefined') {
    // Ensure document.querySelector is available
    if (!document.querySelector) {
      document.querySelector = vi.fn(() => null);
    }
  }

  // Mock ResizeObserver for Vuetify components
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global.ResizeObserver = class ResizeObserver {
    observe() {
      // Mock implementation
    }
    unobserve() {
      // Mock implementation
    }
    disconnect() {
      // Mock implementation
    }
  } as any;
}

// Also set on global for Node.js environment compatibility
if (typeof global !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).window = window;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).localStorage = window.localStorage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).sessionStorage = window.sessionStorage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).document = document;
}

// Global test configuration
config.global.mocks = {
  $t: (key: string) => key, // Mock i18n
  $router: {
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
  },
  $route: {
    path: '/',
    name: 'home',
    params: {},
    query: {},
  },
};
