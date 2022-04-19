/**
 * @file: ContentType.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum ContentType {
  Text = 1,
  Photo,
  Video,
  Audio,
}

export const ContentTypeValueSet = new Set([
  ContentType.Text,
  ContentType.Photo,
  ContentType.Video,
  ContentType.Audio,
]);
