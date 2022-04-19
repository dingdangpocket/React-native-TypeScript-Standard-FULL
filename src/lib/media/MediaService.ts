/**
 * @file: MediaLibrary.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { base64EncodedDataFromDataURI } from '@euler/utils/base64EncodedDataFromDataURI';
import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { nanoid } from 'nanoid/non-secure';

export type MediaDataSource =
  | {
      type: 'dataUri';
      dataUri: string;
    }
  | {
      type: 'buffer';
      buffer: Buffer;
      mimeType: string;
    }
  | {
      type: 'localFileUri';
      fileUri: string;
    };

export class MediaService {
  static shared = new MediaService();

  async saveToLibrary(dataSource: MediaDataSource): Promise<{
    status: 'unauthorized' | 'ok';
  }> {
    let localUri = '';
    let deleteWhenDone = false;
    if (dataSource.type === 'dataUri' || dataSource.type === 'buffer') {
      let data = '';
      let mimeType = '';
      if (dataSource.type === 'dataUri') {
        [data, mimeType] = base64EncodedDataFromDataURI(dataSource.dataUri);
      } else {
        data = dataSource.buffer.toString('base64');
        mimeType = dataSource.mimeType;
      }

      const ext = /jpe?g/.test(mimeType) ? '.jpeg' : '.png';
      const basename = nanoid(64);
      const filename = `${basename}${ext}`;
      localUri = `${FileSystem.cacheDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(localUri, data, {
        encoding: 'base64',
      });
      deleteWhenDone = true;
    } else {
      localUri = dataSource.fileUri;
    }

    const status = await MediaLibrary.getPermissionsAsync();
    if (!status.granted) {
      if (status.canAskAgain) {
        const result = await MediaLibrary.requestPermissionsAsync();
        if (!result.granted) {
          return { status: 'unauthorized' };
        }
      } else {
        return { status: 'unauthorized' };
      }
    }

    await MediaLibrary.saveToLibraryAsync(localUri);

    if (deleteWhenDone) {
      try {
        await FileSystem.deleteAsync(localUri);
      } catch (e) {}
    }

    return { status: 'ok' };
  }
}
