import { ImageAnotationMetadata } from '@euler/app/flows/media/annotation/functions/AnnotationMetadata';
import { UploadedFile } from '@euler/model/UploadedFile';

export type TaskMedia = {
  id: number;
  cid: string;
  type: string;
  url: string;
  coverUrl?: string;
  title?: string;
  subTitle?: string;
  dateRef?: string | Date;
  createdAt: string | Date;
  remark?: string;
  annotationMetadata?: string;
};

export type TaskMediaCommitPayload = Omit<
  TaskMedia,
  'id' | 'dateRef' | 'createdAt' | 'cid'
> & { id?: number };

export type RemoteTaskMediaSource = {
  type: 'remote';
  url: string;
  cid: string;
};

export type LocalTaskMediaSource = {
  type: 'local';
  localFileUri: string;
  state:
    | { status: 'queued' }
    | {
        status: 'uploading';
        progress: number;
      }
    | {
        status: 'error';
        error: Error;
      }
    | {
        status: 'uploaded';
        result: UploadedFile;
      };
};

export type TaskMediaStaged = Omit<
  TaskMediaCommitPayload,
  'url' | 'annotationMetadata'
> & {
  _key: string;
  _source: RemoteTaskMediaSource | LocalTaskMediaSource;
  annotationMetadata?: ImageAnotationMetadata;
};
