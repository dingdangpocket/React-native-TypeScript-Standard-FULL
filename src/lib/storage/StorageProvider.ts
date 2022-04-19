/**
 * @file: StorageProvider.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export interface StorageProvider {
  isAvailableAsync(): Promise<boolean>;
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  multiRemove(keys: string[]): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
}
