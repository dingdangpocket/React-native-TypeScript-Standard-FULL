/**
 * @file: mediaInfoToMediaObject.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { MediaObject } from '@euler/model';
import { MediaInfo } from '@euler/model/report';

export function toMediaObject(mediaInfo: MediaInfo): MediaObject {
  return {
    type: mediaInfo.type.startsWith('image/') ? 'image' : 'video',
    id: mediaInfo.id,
    url: mediaInfo.url,
    coverUrl: mediaInfo.coverUrl,
  };
}
