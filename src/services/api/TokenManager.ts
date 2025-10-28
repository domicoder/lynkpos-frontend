/* eslint-disable no-console */
import { ref } from 'vue';
import type { TokenPair } from './types';

class TokenManager {
  private static instance: TokenManager;
  private tokens = ref<TokenPair | null>(null);
  private refreshPromise: Promise<string> | null = null;

  private constructor() {
    this.loadTokensFromStorage();
  }

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }

    return TokenManager.instance;
  }

  get accessToken(): string | null {
    return this.tokens.value?.accessToken || null;
  }

  get refreshToken(): string | null {
    return this.tokens.value?.refreshToken || null;
  }

  get isTokenExpired(): boolean {
    if (!this.tokens.value) return true;

    return Date.now() >= this.tokens.value.expiresAt;
  }

  get isAuthenticated(): boolean {
    return !!this.tokens.value && !this.isTokenExpired;
  }

  setTokens(tokens: TokenPair): void {
    this.tokens.value = tokens;
    this.saveTokensToStorage();
  }

  clearTokens(): void {
    this.tokens.value = null;
    this.clearTokensFromStorage();
    this.refreshPromise = null;
  }

  async getValidAccessToken(): Promise<string | null> {
    if (!this.tokens.value) return null;

    if (!this.isTokenExpired) {
      return this.accessToken;
    }

    if (this.refreshPromise) {
      try {
        return await this.refreshPromise;
      } catch {
        return null;
      }
    }

    this.refreshPromise = this.refreshAccessToken();

    try {
      return await this.refreshPromise;
    } catch {
      return null;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      const newTokens: TokenPair = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || this.refreshToken,
        expiresAt: Date.now() + data.expiresIn * 1000,
      };

      this.setTokens(newTokens);

      return newTokens.accessToken;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  private loadTokensFromStorage(): void {
    try {
      const stored =
        sessionStorage.getItem('auth_tokens') ||
        localStorage.getItem('auth_tokens');

      if (stored) {
        const parsed = JSON.parse(stored) as TokenPair;

        if (Date.now() < parsed.expiresAt + 7 * 24 * 60 * 60 * 1000) {
          this.tokens.value = parsed;
        }
      }
    } catch (error) {
      console.warn('Error loading tokens from storage:', error);
    }
  }

  private saveTokensToStorage(): void {
    if (!this.tokens.value) return;

    try {
      const tokenData = JSON.stringify(this.tokens.value);

      sessionStorage.setItem('auth_tokens', tokenData);
      localStorage.setItem('auth_tokens', tokenData);
    } catch (error) {
      console.warn('Error saving tokens to storage:', error);
    }
  }

  private clearTokensFromStorage(): void {
    sessionStorage.removeItem('auth_tokens');
    localStorage.removeItem('auth_tokens');
  }
}

export default TokenManager;
