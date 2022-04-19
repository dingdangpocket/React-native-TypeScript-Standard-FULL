/**
 * @file: index.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2015-2017 sichuan zhichetech co., ltd.
 */

import { SecureStorageProvider } from '@euler/lib/storage/impl/SecureStorageProvider';
import { StorageProvider } from '@euler/lib/storage/StorageProvider';
import { AsyncStorageProvider } from './impl/AsyncStorageProvider';

export * from './StorageProvider';

export function getDefaultStorageProvider(): StorageProvider {
  return new AsyncStorageProvider();
}

export async function getDefaultSecureStorageProviderOrFallback(): Promise<StorageProvider> {
  if (await SecureStorageProvider.shared.isAvailableAsync()) {
    return SecureStorageProvider.shared;
  }
  return getDefaultStorageProvider();
}
