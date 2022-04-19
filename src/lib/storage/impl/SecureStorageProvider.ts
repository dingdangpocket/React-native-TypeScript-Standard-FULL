/**
 * @file: SecureStorageProvider.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { StorageProvider } from '@euler/lib/storage';
import { onErrorIgnore } from '@euler/utils';
import * as SecureStore from 'expo-secure-store';

export class SecureStorageProvider implements StorageProvider {
  static readonly shared = new SecureStorageProvider();

  async isAvailableAsync(): Promise<boolean> {
    return await SecureStore.isAvailableAsync();
  }

  async getItem(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  }

  async removeItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  }

  async multiRemove(keys: string[]): Promise<void> {
    await Promise.all(
      // eslint-disable-next-line @typescript-eslint/promise-function-async
      keys.map(key => SecureStore.deleteItemAsync(key).catch(onErrorIgnore)),
    );
  }

  async clear(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getAllKeys(): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
}
