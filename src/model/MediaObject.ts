/**
 * @file: MediaObject.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export type MediaObject = {
  id: string;
  url: string;
  type: 'image' | 'video';
  coverUrl?: string | null;
};
