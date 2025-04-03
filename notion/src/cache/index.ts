/**
 * Simple in-memory cache implementation for Notion API responses
 */

export interface CacheOptions {
  ttl: number; // Time to live in seconds
  maxSize?: number; // Maximum number of items to store
}

export interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

export class NotionCache {
  private cache: Map<string, CacheItem<any>>;
  private options: CacheOptions;

  constructor(options: CacheOptions) {
    this.cache = new Map();
    this.options = options;
  }

  /**
   * Get a value from the cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if item has expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  /**
   * Set a value in the cache
   */
  set<T>(key: string, value: T): void {
    // Check cache size limit
    if (this.options.maxSize && this.cache.size >= this.options.maxSize) {
      // Remove oldest item
      const oldestKey = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.expiresAt - b.expiresAt)[0][0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.options.ttl * 1000,
    });
  }

  /**
   * Delete a value from the cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get the current size of the cache
   */
  size(): number {
    return this.cache.size;
  }
}

// Create a singleton instance with default options
export const defaultCache = new NotionCache({
  ttl: 600, // 10 minutes
  maxSize: 1000, // Maximum 1000 items
}); 