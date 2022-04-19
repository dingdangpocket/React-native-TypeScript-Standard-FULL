/**
 * @file: index.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import * as fs from 'expo-file-system';
import { nanoid } from 'nanoid/non-secure';

export async function makeTempFile(ext?: string): Promise<string> {
  const basename = nanoid(64);
  const dir = `${fs.cacheDirectory}temp/`;
  const info = await fs.getInfoAsync(dir);
  if (!info.exists) {
    await fs.makeDirectoryAsync(dir, { intermediates: true });
  }
  const filename = `${basename}${ext ?? ''}`;
  return `${dir}${filename}`;
}
