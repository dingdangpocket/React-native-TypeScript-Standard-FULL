/**
 * @file: getMediaPreviewUrl.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { config } from '@euler/config';
import { api } from '@euler/services/factory';

export function getMediaPreviewUrl(cid: string) {
  return api.url('/medias/:cid.jpg', { cid }, config.apiEndpoint);
}

export function getVideoStreamUrl(cid: string) {
  return api.url('/videos/:cid.mp4', { cid }, config.apiEndpoint);
}
