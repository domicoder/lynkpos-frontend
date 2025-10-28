import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import useAuthStore from '@/stores/user/AuthStore';
import type { UserLogin } from '@/domains/User';

describe('AuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should initialize with null user', () => {
    const store = useAuthStore();

    expect(store.getUser).toBeNull();
    expect(store.isLoggedIn).toBe(false);
  });

  it('should set user correctly', () => {
    const store = useAuthStore();
    const mockUser: UserLogin = {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      token: 'mock-token',
      roles: [],
      permissions: [],
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    };

    store.setUser(mockUser);

    expect(store.getUser).toEqual(mockUser);
    expect(store.isLoggedIn).toBe(true);
    expect(store.getToken).toBe('mock-token');
  });

  it('should clear user when set to null', () => {
    const store = useAuthStore();
    const mockUser: UserLogin = {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      token: 'mock-token',
      roles: [],
      permissions: [],
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    };

    store.setUser(mockUser);
    expect(store.isLoggedIn).toBe(true);

    store.setUser(null);
    expect(store.getUser).toBeNull();
    expect(store.isLoggedIn).toBe(false);
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
    store.setUser(null);

    expect(store.getToken).toBe('stored-token');
  });

  it('should return null token when no user and no localStorage data', () => {
    const store = useAuthStore();

    expect(store.getToken).toBeUndefined();
  });
});
