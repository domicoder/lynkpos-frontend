/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CacheItem } from './types';

class CacheManager {
  private static instance: CacheManager;
  private cache = new Map<string, CacheItem<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutos

  private constructor() {
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }

    return CacheManager.instance;
  }

  generateKey(
    method: string,
    url: string,
    params?: Record<string, any>,
  ): string {
    const paramsStr = params ? JSON.stringify(params) : '';

    return `${method}:${url}:${paramsStr}`;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };

    this.cache.set(key, item);
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key) as CacheItem<T> | undefined;

    if (!item) return null;

    if (this.isExpired(item)) {
      this.cache.delete(key);

      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);

    if (!item) return false;

    if (this.isExpired(item)) {
      this.cache.delete(key);

      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp > item.ttl;
  }

  private cleanup(): void {
    for (const [key, item] of this.cache.entries()) {
      if (this.isExpired(item)) {
        this.cache.delete(key);
      }
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export default CacheManager;
