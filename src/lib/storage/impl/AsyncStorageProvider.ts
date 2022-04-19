/**
 * @file: TaroStorageProvider.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2015-2017 sichuan zhichetech co., ltd.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageProvider } from '../StorageProvider';

export class AsyncStorageProvider implements StorageProvider {
  static readonly shared = new AsyncStorageProvider();

  async isAvailableAsync(): Promise<boolean> {
    return true;
  }

  async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  async multiRemove(keys: string[]): Promise<void> {
    await AsyncStorage.multiRemove(keys);
  }

  async clear(): Promise<void> {
    await AsyncStorage.clear();
  }

  async getAllKeys(): Promise<string[]> {
    return await AsyncStorage.getAllKeys();
  }
}
