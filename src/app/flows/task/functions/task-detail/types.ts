/**
 * @file: types.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { ImageAnotationMetadata } from '@euler/app/flows/media/annotation/functions/AnnotationMetadata';

export type TaskFileUploadRequestContext = {
  type: 'item-inspection';
  siteInspectionManagerId: string;
  siteId: number;
  key: string;
  mediaKey?: string;
  annotationMetadata?: ImageAnotationMetadata;
};
