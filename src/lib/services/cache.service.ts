/**
 * @file cache.service.ts
 * @author Eric Xu <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { StorageService } from './storage.service';

const CACHE_ENTRY_KEY_PREFIX = '_cache_entry';

function buildKey(key: string): string {
  return `${CACHE_ENTRY_KEY_PREFIX}_${key}`;
}

interface CacheEntry<T> {
  expires: number;
  item: T;
}

/**
 * @class Represents the cache service.
 */
export class CacheService {
  constructor(public storage: StorageService) {}

  /**
   * Get the cached item.
   * @param {String} key cache key
   * @returns {*} cached item
   */
  async get<T = any>(key: string): Promise<T | undefined> {
    key = buildKey(key);
    const data = await this.storage.get<CacheEntry<T>>(key);
    if (!data) return undefined;
    if (data.expires && data.expires < Date.now()) {
      await this.storage.remove(key);
      return;
    }
    return data.item;
  }

  /**
   * Set cached item w/ the optional expiration.
   * @param {String} key cache key
   * @param {*} item item to cache.
   * @param {Number} [expires=0] cache expiry, 0 to not expire.
   */
  async set<T = any>(key: string, item: T, expires = 0): Promise<void> {
    key = buildKey(key);
    const entry: CacheEntry<T> = { expires, item };
    await this.storage.set(key, entry);
  }

  /**
   * Remove the cache by the given key.
   * @param {String} key cache key to remove
   */
  async remove(key: string): Promise<void> {
    key = buildKey(key);
    await this.storage.remove(key);
  }
}
