/**
 * @file: cache.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { config } from '@euler/config';
import * as fs from 'expo-file-system';

console.log(fs.cacheDirectory);

const getCacheFileUri = (path: string) => {
  if (path.startsWith('/')) path = path.substring(1);
  return `${fs.cacheDirectory}${config.bundleId}/${path}`;
};

const getDirectory = (uri: string) => {
  const index = uri.lastIndexOf('/');
  if (index <= 0) return '';
  if (index === uri.length - 1) return uri;
  return uri.substring(0, index + 1);
};

export const ensureCacheDirectoryExists = async (
  directoryUri: string,
): Promise<void> => {
  const fileInfo = await fs.getInfoAsync(directoryUri);
  if (!fileInfo.exists) {
    await fs.makeDirectoryAsync(directoryUri, { intermediates: true });
  }
};

export const readCachedFileContents = async (
  path: string,
): Promise<string | null> => {
  try {
    const fileUri = getCacheFileUri(path);
    return await fs.readAsStringAsync(fileUri, { encoding: 'utf8' });
  } catch {}
  return null;
};

export const writeContentsToCachedFile = async (
  path: string,
  contents: string,
): Promise<void> => {
  const fileUri = getCacheFileUri(path);
  const directoryUri = getDirectory(fileUri);
  await ensureCacheDirectoryExists(directoryUri);
  await fs.writeAsStringAsync(fileUri, contents);
};

export const deleteCachedFile = async (path: string) => {
  const fileUri = getCacheFileUri(path);
  await fs.deleteAsync(fileUri, { idempotent: true });
};
