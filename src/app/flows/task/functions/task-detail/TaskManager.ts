/**
 * @file: TaskManager.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { UpdateTaskInformation } from '@euler/model';
import { InspectionCategory } from '@euler/model/enum';
import {
  CachedTaskDetail,
  Inspection,
  TaskDetailProjection,
  TaskDetailVersions,
} from '@euler/model/task-detail';
import { TaskService } from '@euler/services';
import { ServiceFactory } from '@euler/services/factory';
import { makeDebug } from '@euler/utils';
import { freeze, produce } from 'immer';
import { WritableDraft } from 'immer/dist/internal';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import {
  deleteCachedFile,
  readCachedFileContents,
  writeContentsToCachedFile,
} from './cache';
import { InspectionManager } from './inspection/InspectionManager';
import { PreInspectionManager } from './inspection/PreInspectionManager';
import { MediaFileUploadController } from './MediaFileUploadController';
import { detailVersionsMatch, getDetailVersions } from './versions';

const debug = makeDebug('taskmanager');

const DetailProps: (keyof TaskDetailProjection)[] = [
  'basicInfo',
  'preInspection',
  'inspection',
  'obdInspection',
  'construction',
  'deliveryCheck',
];

type TaskManagerOptions = {
  mediaFileUpload?: {
    concurrency?: number;
  };
};

/**
 * @class Represents a vehicle service task manager implementation.
 */
export class TaskManager {
  // the version of the task manager's protocol implementation.
  static readonly VERSION = '1.0';

  private static readonly _taskManagerMap = new Map<string, TaskManager>();

  // the taskNo of the managed task
  readonly taskNo: string;

  readonly taskService: TaskService;

  // pre-inspection mangaer.
  readonly preInspectionManager = new PreInspectionManager(this);

  // inspection manager.
  readonly inspectionManager = new InspectionManager<Inspection>(
    InspectionCategory.Normal,
    this,
  );

  // the shared file upload controller per task.
  readonly uploadController: MediaFileUploadController;

  // observable that delivers the most recent version of task detail.
  readonly detail$ = new Subject<CachedTaskDetail>();
  readonly error$ = new Subject<Error>();
  readonly refreshing$ = new BehaviorSubject<boolean>(false);

  // the key of the cached detail data in local cache file system
  private readonly cacheFilePath: string;

  private _active = false;
  private _internalSubscription?: Subscription;
  private _detail: CachedTaskDetail | undefined;

  private constructor(
    taskNo: string,
    serviceFactory: ServiceFactory,
    options?: TaskManagerOptions,
  ) {
    this.taskNo = taskNo;
    this.cacheFilePath = `task/${taskNo}/detail.json`;
    this.taskService = serviceFactory.taskService;
    this.uploadController = new MediaFileUploadController({
      mediaFileService: serviceFactory.mediaFileService,
      concurrency: options?.mediaFileUpload?.concurrency,
    });
    this._detail = undefined;
  }

  /**
   * Get the observable that emits a sequence of task detail objects.
   */
  get observable(): Observable<CachedTaskDetail> {
    void this.start();
    return this.detail$;
  }

  /**
   * Gets the cached detail.
   */
  get cachedDetail(): CachedTaskDetail {
    if (!this._detail) {
      throw new Error('cached detail does not exist, this must be bug');
    }
    return this._detail!;
  }

  get cachedVersions(): TaskDetailVersions | undefined {
    if (!this._detail) return undefined;
    return getDetailVersions(this._detail);
  }

  /**
   * Get the task manager instance for the given task.
   */
  static get(
    taskNo: string,
    serviceFactory: ServiceFactory,
    options?: TaskManagerOptions,
  ) {
    let manager = this._taskManagerMap.get(taskNo);
    if (!manager) {
      manager = new TaskManager(taskNo, serviceFactory, options);
      this._taskManagerMap.set(taskNo, manager);
    }
    return manager;
  }

  async start() {
    if (this._active) return;

    this._setupCacheAutoFlush();

    void this._load();

    this._active = true;

    debug('[%s] started', this.taskNo);
  }

  stop() {
    this.preInspectionManager.dispose();
    this.inspectionManager.dispose();

    this._internalSubscription?.unsubscribe();
    this._internalSubscription = undefined;
    this._active = false;
    this._detail = undefined;
    TaskManager._taskManagerMap.delete(this.taskNo);

    debug('[%s] stopped', this.taskNo);
  }

  refresh() {
    void this._fetch({ force: true, refreshing: true });
  }

  async updateBasicInfo(params: UpdateTaskInformation) {
    const { versions } = await this.taskService.updateTaskInformation(
      this.taskNo,
      params,
    );
    this.produceWithVersions(versions, draft => {
      const { dashboardImgUrl, deliveryCheckSignatureImgUrl, ...rest } = params;
      Object.assign(draft.basicInfo, rest);
      if (dashboardImgUrl || deliveryCheckSignatureImgUrl) {
        if (dashboardImgUrl) {
          draft.preInspection.dashboardImgUrl = dashboardImgUrl;
        }
        if (deliveryCheckSignatureImgUrl) {
          draft.preInspection.signatureImgUrl = deliveryCheckSignatureImgUrl;
        }
        draft.preInspection.version = versions.preInspection;
      }
    });
  }

  produceWithVersions(
    versions: TaskDetailVersions,
    recipe: (draft: WritableDraft<CachedTaskDetail>) => void,
  ) {
    const projection: TaskDetailProjection = {};
    const current =
      this._detail ??
      ({ __VERSION: TaskManager.VERSION } as any as CachedTaskDetail);
    const detail = produce(current, draft => {
      recipe(draft);
      draft.version = versions.detail;
      draft.__TIMESTAMP = Date.now();

      for (const key of DetailProps) {
        if (draft[key] == null || draft[key].version !== versions[key]) {
          projection[key] = true;
        }
      }
    });
    // schedule fetch data from server.
    if (Object.keys(projection).length) {
      void this._fetch({ projection });
    }
    this.detail$.next(freeze(detail));
  }

  //#region private implementation details

  private async _load() {
    // start initial loading of the task detail data.
    let cachedVersions: TaskDetailVersions | undefined = undefined;
    const contents = await readCachedFileContents(this.cacheFilePath);
    if (contents != null) {
      try {
        const cached: CachedTaskDetail = JSON.parse(contents);

        // make sure the protocol version matches otherwise,
        if (cached.__VERSION === TaskManager.VERSION) {
          const detail = freeze(cached);
          cachedVersions = getDetailVersions(detail);
          debug(
            '[%s] loaded cached detail (version: %O)',
            this.taskNo,
            cachedVersions,
          );
          this._detail = detail;
          this.detail$.next(detail);
        } else {
          debug('[%s] cached detail discarded', this.taskNo);
          await deleteCachedFile(this.cacheFilePath);
        }
      } catch (e) {
        console.error(e);
      }
    }

    let shouldFetchFromServer = true;
    if (cachedVersions) {
      // check the versions
      try {
        debug('[%s] checking server versions... ', this.taskNo);
        const serverVersions = await this.taskService.getTaskDetailVersions(
          this.taskNo,
        );
        debug('[%s] loaded server versions: %O', this.taskNo, serverVersions);
        if (detailVersionsMatch(cachedVersions, serverVersions)) {
          shouldFetchFromServer = false;
          debug('[%s] versions match, use local cache', this.taskNo);
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (shouldFetchFromServer) {
      // begin fetch from server.
      void this._fetch();
    }
  }

  private async _fetch(options?: {
    force?: boolean;
    refreshing?: boolean;
    projection?: TaskDetailProjection;
  }) {
    try {
      const cachedVersions = this.cachedVersions;

      if (options?.refreshing) {
        this.refreshing$.next(true);
        debug('[%s] refreshing detail... ', this.taskNo);
      } else {
        debug(
          '[%s] fetching detail with client versions: %O',
          this.taskNo,
          cachedVersions,
        );
      }

      // todo: how to prevent multiple fetch?
      const { versions, response } = await this.taskService.getTaskDetail(
        this.taskNo,
        options?.force
          ? undefined
          : {
              // projection will take precedence over versions
              projection: options?.projection,
              // this will only fetch updated contents
              projectionByVersions: options?.projection
                ? undefined
                : cachedVersions,
            },
      );

      // update the detail object.
      this.produceWithVersions(versions, draft => {
        for (const key of DetailProps) {
          if (response[key] != null) {
            draft[key] = response[key] as any;
          }
        }
      });
    } catch (e) {
      console.error(e);
      this.error$.next(e as Error);
    } finally {
      if (options?.refreshing) {
        this.refreshing$.next(false);
      }
    }
  }

  private _setupCacheAutoFlush() {
    // an internal subscription used to update the local cache.
    this._internalSubscription = this.detail$.subscribe(async detail => {
      if (detail.__TIMESTAMP === this._detail?.__TIMESTAMP) {
        return;
      }
      this._detail = detail;
      try {
        debug('[%s] saving detail to cache', this.taskNo);
        await writeContentsToCachedFile(
          this.cacheFilePath,
          JSON.stringify(this._detail),
        );
        debug('[%s] detail is kept updated to latest version', this.taskNo);
      } catch (e) {
        console.error(e);
      }
    });
  }

  //#endregion
}
