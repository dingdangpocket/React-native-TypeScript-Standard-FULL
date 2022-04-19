/**
 * @file storage.service.ts
 * @author Eric Xu <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { StorageProvider } from '../storage';

export type Predict<T> = (obj: T) => boolean;
export type ResultFn<T, U, V> = (x: T, y: U) => V;

/**
 * @class local storage helper service.
 */
export class StorageService {
  constructor(private readonly provider: StorageProvider) {}

  /**
   * Get localStorage data by key and given default value.
   * @param {String} key the key of the data to get.
   * @param {Promise<T | undefined>} defaultValue default value if the the data
   * does not exist.
   */
  async get<T = any>(key: string, defaultValue?: T): Promise<T | null> {
    const value = await this.provider.getItem(key);
    if (value == null) {
      return defaultValue as T;
    }
    return JSON.parse(value);
  }

  /**
   * Set localStorage data by given key and value.
   * @param {String} key the key of the data to set.
   * @param {Value} value value to set, null or undefined to remove the data.
   */
  async set<T = any>(key: string, value: T): Promise<void> {
    if (value == null) {
      await this.provider.removeItem(key);
      return;
    }
    await this.provider.setItem(key, JSON.stringify(value));
  }

  /**
   * Remove localStorage data by the given key.
   * @param {String} key the key of the data to set.
   */
  async remove(key: string): Promise<void> {
    await this.provider.removeItem(key);
  }
}
