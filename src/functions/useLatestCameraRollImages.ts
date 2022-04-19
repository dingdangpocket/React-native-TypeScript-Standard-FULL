/**
 * @file: useLatestCameraRollImages.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { isNotNull, onErrorIgnore, onErrorReturn } from '@euler/utils';
import { usePersistFn } from '@euler/utils/hooks';
import { manipulateAsync } from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';
import { PermissionStatus } from 'expo-media-library';
import { useEffect, useState } from 'react';

export const useLatestCameraRollImages = (options: {
  count: number;
  resize?: { width?: number; height?: number };
}) => {
  const [images, setImages] = useState<string[]>([]);
  const fetchAssets = usePersistFn(async () => {
    const { assets } = await MediaLibrary.getAssetsAsync({
      first: options.count,
      mediaType: 'photo',
      sortBy: 'creationTime',
    });
    const uris = assets.map(x => x.uri);
    if (options.resize) {
      const resized = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/promise-function-async
        uris.map(uri =>
          manipulateAsync(uri, [
            {
              resize: options.resize!,
            },
          ]).catch(onErrorReturn(null)),
        ),
      );
      setImages(resized.filter(isNotNull).map(x => x.uri));
    } else {
      setImages(uris);
    }
  });
  useEffect(() => {
    if (options.count === 0) return;
    (async () => {
      const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
      if (status === PermissionStatus.GRANTED) {
        void fetchAssets();
        return;
      }
      if (
        status === PermissionStatus.UNDETERMINED ||
        (status === PermissionStatus.DENIED && canAskAgain)
      ) {
        const result = await MediaLibrary.requestPermissionsAsync();
        if (result.status === PermissionStatus.GRANTED) {
          void fetchAssets();
        }
      }
    })().catch(onErrorIgnore);
  }, [fetchAssets, options.count]);
  return images;
};
