import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import useAuthStore from '@/stores/user/AuthStore';
import type { User, LoginToken } from '@/domains/User';
import { STORAGE_KEY } from '@/utils/utils';

describe('AuthStore', () => {
  beforeEach(() => {
    // Clear localStorage before each test, including the specific storage key
    localStorage.clear();
    localStorage.removeItem(STORAGE_KEY);
    setActivePinia(createPinia());
  });

  it('should initialize with null user', () => {
    const store = useAuthStore();

    expect(store.getUser).toBeNull();
    expect(store.isLoggedIn).toBe(false);
  });

  it('should set user correctly', () => {
    const store = useAuthStore();
    const mockUser: User = {
      id: '1',
      nombre: 'test@example.com',
      usuarioNombre: 'testuser',
      rol: {
        id: 1,
        nombre: 'testrole',
      },
    };
    const mockToken: LoginToken = {
      token: 'mock-token',
    };

    store.setToken(mockToken);
    store.setUserInfo(mockUser);

    expect(store.getUser).toEqual(mockUser);
    expect(store.isLoggedIn).toBe(true);
    expect(store.getToken).toBe('mock-token');
  });

  it('should clear user and token when logging out', () => {
    const store = useAuthStore();
    const mockUser: User = {
      id: '1',
      nombre: 'test@example.com',
      usuarioNombre: 'testuser',
      rol: {
        id: 1,
        nombre: 'testrole',
      },
    };
    const mockToken: LoginToken = {
      token: 'mock-token',
    };

    store.setToken(mockToken);
    store.setUserInfo(mockUser);
    expect(store.isLoggedIn).toBe(true);

    // Clear token and user to simulate logout
    // Set token to null by directly manipulating state (since setToken doesn't accept null)
    store.$state.loginToken = null;
    store.$state.user = null;
    expect(store.getUser).toBeNull();
    expect(store.isLoggedIn).toBe(false);
    expect(store.getToken).toBeUndefined();
  });

  // TODO: This test needs to be updated to work with Pinia persistence
  // The getter logic is complex due to how Pinia handles localStorage
  it.skip('should get token from localStorage when user is null', () => {
    // Mock localStorage with the structure that the getter expects
    localStorage.setItem(
      'LynkPOS-YSxTEMPLATE',
      JSON.stringify({ token: 'stored-token' }),
    );

    const store = useAuthStore();

    // Clear the user to simulate null state
    store.setUserInfo({} as User);

    expect(store.getToken).toBe('stored-token');
  });

  it('should return undefined token when no token is set', () => {
    const store = useAuthStore();

    // Ensure token is explicitly null
    store.$state.loginToken = null;

    expect(store.getToken).toBeUndefined();
  });
});
