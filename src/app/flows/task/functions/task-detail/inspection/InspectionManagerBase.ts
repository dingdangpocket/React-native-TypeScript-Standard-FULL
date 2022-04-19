/**
 * @file: InspectionFlowManagerBase.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { InspectionCategory } from '@euler/model/enum';
import {
  CachedTaskDetail,
  Inspection,
  TaskDetailVersions,
  VersionedResponse,
} from '@euler/model/task-detail';
import { WritableDraft } from 'immer/dist/internal';
import { TaskManager } from '../TaskManager';

// type Category = InspectionCategory.Pre | InspectionCategory.Normal;

export abstract class InspectionManagerBase<T extends Inspection> {
  constructor(
    readonly category: InspectionCategory,
    readonly taskManager: TaskManager,
  ) {}

  protected get taskNo() {
    return this.taskManager.taskNo;
  }

  protected get taskService() {
    return this.taskManager.taskService;
  }

  protected get cachedDetail() {
    return this.taskManager.cachedDetail;
  }

  protected getTargetInspection(detail: CachedTaskDetail): T {
    return (
      this.category === InspectionCategory.Pre
        ? detail.preInspection
        : detail.inspection
    ) as T;
  }

  protected handleVersionedResponse<U>(
    versionedResponse: VersionedResponse<U>,
    recipe: (
      draft: WritableDraft<CachedTaskDetail>,
      context: {
        response: U;
        inspection: T;
        version: number;
        original: T;
      },
    ) => void,
  ) {
    this.produceWithVersions(versionedResponse.versions, (draft, context) => {
      recipe(draft, { ...context, response: versionedResponse.response });
    });
  }

  protected produceWithVersions(
    versions: TaskDetailVersions,
    recipe: (
      draft: WritableDraft<CachedTaskDetail>,
      context: {
        inspection: T;
        version: number;
        original: T;
      },
    ) => void,
  ) {
    const original = this.getTargetInspection(this.cachedDetail);
    const version =
      this.category === InspectionCategory.Pre
        ? versions.preInspection
        : versions.inspection;

    if (
      version === original.version &&
      this.cachedDetail.version === versions.detail
    ) {
      // nothing changed
      return;
    }

    this.taskManager.produceWithVersions(versions, draft => {
      const inspection = this.getTargetInspection(draft);
      recipe(draft, {
        inspection,
        version,
        original,
      });
      inspection.version = version;
    });
  }

  abstract dispose(): void;
}
