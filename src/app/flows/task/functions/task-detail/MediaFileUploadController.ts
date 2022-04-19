/**
 * @file: MediaUploadQeuue.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { UploadedFile } from '@euler/model';
import { ImageFileExtraInfo, VideoFileExtraInfo } from '@euler/model/common';
import { FileUploadParameters, MediaFileService } from '@euler/services';
import { makeDebug, sleep } from '@euler/utils';
import { Immutable } from 'immer';
import { nanoid } from 'nanoid/non-secure';
import { TaskFileUploadRequestContext } from './types';

const debug = makeDebug('fileuploader');

export type MediaUploadTaskEvent =
  | {
      type: 'queued';
    }
  | {
      type: 'begin';
    }
  | {
      type: 'progress';
      progress: number;
    }
  | {
      type: 'error';
      error: Error;
    }
  | ({
      type: 'finished';
    } & (
      | {
          mediaType: 'image';
          result: UploadedFile<ImageFileExtraInfo>;
        }
      | {
          mediaType: 'video';
          result: UploadedFile<VideoFileExtraInfo>;
        }
    ))
  | {
      type: 'abort';
      error?: Error;
    };

export type MediaUploadEventListener = (
  e: MediaUploadTaskEvent,
  task: Immutable<MediaUploadTask>,
) => void;

export type MediaUploadRequest<T> = {
  context?: T;
  localFileUri: string;
  contentType: string;
  type: 'image' | 'video';
  parameters?: FileUploadParameters;
  listener?: MediaUploadEventListener;
  simulateFailure?: boolean;
};

export type MediaUploadTask<T = unknown> = {
  key: string;
  status: 'queued' | 'inprogress' | 'complete' | 'aborted';
  request: MediaUploadRequest<T>;
  abortController: AbortController;
};

const kDefaultConcurrency = 3;

export class MediaFileUploadController {
  private readonly concurrency: number;
  private readonly mediaFileService: MediaFileService;

  private readonly _queue: MediaUploadTask[] = [];
  private readonly _inprogressTasks = new Map<string, MediaUploadTask>();
  private readonly _listeners: MediaUploadEventListener[] = [];

  constructor({
    mediaFileService,
    concurrency = kDefaultConcurrency,
  }: {
    concurrency?: number;
    mediaFileService: MediaFileService;
  }) {
    this.concurrency = concurrency;
    this.mediaFileService = mediaFileService;
  }

  /**
   * Add event listener to the media file upload controller.
   * @param listener
   * @returns
   */
  addListener(listener: MediaUploadEventListener): () => void {
    this._listeners.push(listener);
    return () => {
      const index = this._listeners.indexOf(listener);
      if (index >= 0) {
        this._listeners.splice(index, 1);
      }
    };
  }

  /**
   * Queue a media file upload task.
   * @param {MediaUploadRequest} request
   */
  enqueue<T extends TaskFileUploadRequestContext>(
    request: MediaUploadRequest<T>,
  ) {
    const task: MediaUploadTask = {
      key: nanoid(),
      status: 'queued',
      request,
      abortController: new AbortController(),
    };
    debug('queued task:', task);
    this._queue.push(task);
    task.status = 'queued';
    this.emit({ type: 'queued' }, task);
    this.next();
  }

  /**
   * Request to abort the given task by the key if available.
   * @param {String} key key of the request
   */
  abort(key: string): boolean {
    let task = this._inprogressTasks.get(key);
    if (task) {
      task.status = 'aborted';
      task.abortController.abort();
      return true;
    }
    const index = this._queue.findIndex(x => x.key === key);
    if (index >= 0) {
      task = this._queue[index];
      this._queue.splice(index, 1);
      task.status = 'aborted';
      this.emit({ type: 'abort' }, task);
      debug('task aborted:', task);
      return true;
    }
    return false;
  }

  dispose() {
    debug('dispose');
    this._listeners.splice(0, this._listeners.length);
    for (const task of this._inprogressTasks.values()) {
      task.request = { ...task.request, listener: undefined };
      task.abortController.abort();
    }
    this._inprogressTasks.clear();
    this._queue.splice(0, this._queue.length);
  }

  private next() {
    if (this._inprogressTasks.size >= this.concurrency) {
      return;
    }

    const task = this._queue.shift();
    if (!task) return;

    void this.exec(task);
  }

  private emit(event: MediaUploadTaskEvent, task: MediaUploadTask) {
    task.request.listener?.(event, task);

    for (const listener of this._listeners) {
      listener(event, task);
    }
  }

  private async exec(task: MediaUploadTask) {
    debug('executing upload task:', task);

    if (task.request.simulateFailure) {
      await sleep(3000);
      debug('upload failed by simulating');
      task.status = 'complete';
      this.emit({ type: 'error', error: new Error('simulated error') }, task);
      this.next();
      return;
    }

    if (task.abortController.signal.aborted) {
      debug('task has been aborted');
      task.status = 'aborted';
      this.next();
      return;
    }

    this._inprogressTasks.set(task.key, task);

    task.status = 'inprogress';

    this.mediaFileService
      .upload(task.request.localFileUri, {
        ...task.request.parameters,
        abortController: task.abortController,
        onProgress: (e: ProgressEvent) => {
          debug('progress updated:', e, task);
          this.emit(
            {
              type: 'progress',
              progress: e.total > 0 ? e.loaded / e.total : 0,
            },
            task,
          );
        },
      })
      .then(result => {
        debug('upload success, result:', result, task);
        if (task.request.type === 'image') {
          this.emit(
            {
              type: 'finished',
              mediaType: 'image',
              result: result as UploadedFile<ImageFileExtraInfo>,
            },
            task,
          );
        } else {
          this.emit(
            {
              type: 'finished',
              mediaType: 'video',
              result: result as UploadedFile<VideoFileExtraInfo>,
            },
            task,
          );
        }
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          debug('task aborted:', task);
          this.emit({ type: 'abort', error: err }, task);
        } else {
          debug('upload failed: ', err);
          this.emit({ type: 'error', error: err }, task);
        }
      })
      .finally(() => {
        task.status = 'complete';
        this._inprogressTasks.delete(task.key);
        this.next();
      });
  }
}
