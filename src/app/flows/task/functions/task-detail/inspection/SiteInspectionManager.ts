/* eslint-disable @typescript-eslint/no-use-before-define */
/**
 * @file: SiteInspectionManager.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import {
  isComplexInspectionResultDataType,
  isSimpleNumericInspectionResultDataType,
  isSimpleStringInspectionResultDataType,
} from '@euler/functions/inspectionResultDataTypeHelpers';
import {
  InspectionItemInfo,
  InspectionSiteInfo,
} from '@euler/functions/useInventory';
import { AnyMedia } from '@euler/model';
import {
  AbnormalLevel,
  OptionValueType,
  SeverityLevel,
  SiteInspectionType,
} from '@euler/model/enum';
import {
  Inspection,
  SiteCustomIssue,
  SiteCustomIssueCommitPayload,
  SiteInspection,
  SiteInspectionCommitPayload,
  SiteInspectionItem,
  SiteInspectionItemCommitPayload,
  SiteInspectionItemComplexResult,
  SiteInspectionItemNumericResult,
  SiteInspectionItemResult,
  SiteInspectionItemStaged,
  SiteInspectionItemStringResult,
  SiteInspectionStaged,
  TaskMediaCommitPayload,
  TaskMediaStaged,
} from '@euler/model/task-detail';
import { array2map } from '@euler/utils/array';
import produce, { freeze, Immutable } from 'immer';
import { WritableDraft } from 'immer/dist/internal';
import { nanoid } from 'nanoid/non-secure';
import { BehaviorSubject } from 'rxjs';
import {
  MediaUploadTask,
  MediaUploadTaskEvent,
} from '../MediaFileUploadController';
import { TaskFileUploadRequestContext } from '../types';
import { InspectionManager } from './InspectionManager';
import { InspectionManagerBase } from './InspectionManagerBase';

export class SiteInspectionManager<
  T extends Inspection,
> extends InspectionManagerBase<T> {
  // represents staged commit payload for site inspection
  readonly staged$: BehaviorSubject<SiteInspectionStaged>;
  readonly removeFileUploadListener: () => void;
  readonly id = nanoid();

  constructor(
    private readonly inspectionManager: InspectionManager<T>,
    private readonly site: InspectionSiteInfo,
    private readonly inspectionType: SiteInspectionType,
    private readonly technicianId: number,
    private readonly technicianName: string,
  ) {
    super(inspectionManager.category, inspectionManager.taskManager);

    // intialize the staged commit payload for this site.
    const inspection = this.getTargetInspection(this.cachedDetail);
    const siteInspection = inspection.sites.find(
      x => x.siteId === this.site.id,
    );

    // convert the site inspection to commit payload
    const staged: SiteInspectionStaged = this.toStaged(siteInspection);

    this.staged$ = new BehaviorSubject(freeze(staged));

    this.removeFileUploadListener =
      this.taskManager.uploadController.addListener((e, task) => {
        this.onFileUploadEvent(e, task as any);
      });
  }

  dispose() {
    this.removeFileUploadListener();
  }

  removeMedia(itemKey: string, key: string) {
    this.taskManager.uploadController.abort(key);
    this.produceItem(itemKey, (item, original) => {
      const k = original.medias.findIndex(x => x._key === key);
      if (k < 0) {
        console.error('Cannot find target media, this must be bug');
        return;
      }
      item.medias.splice(k, 1);
    });
  }

  findMedia(itemKey: string, key: string) {
    const current = this.staged$.getValue();
    const item = current.items.find(x => x._key === itemKey);
    if (!item) return undefined;
    return item.medias.find(x => x._key === key);
  }

  /**
   * Commit the inspected results.
   */
  async commit() {
    // prepare commit payloads by converting staged information
    const staged = this.staged$.getValue();
    let abnormalLevel = AbnormalLevel.Fine;
    let severityLevel = SeverityLevel.None;
    const items: SiteInspectionItemCommitPayload[] = [];
    const customIssues: SiteCustomIssueCommitPayload[] = [];
    for (const stagedItem of staged.items) {
      if (
        stagedItem.abnormalLevel > abnormalLevel ||
        stagedItem.severityLevel > severityLevel
      ) {
        abnormalLevel = stagedItem.abnormalLevel;
        severityLevel = stagedItem.severityLevel;
      }
      if (stagedItem.type === 'item') {
        items.push({
          id: stagedItem.id,
          itemId: stagedItem.itemId,
          name: stagedItem.name,
          label: stagedItem.label,
          abnormalLevel: stagedItem.abnormalLevel,
          severityLevel: stagedItem.severityLevel,
          description: stagedItem.description,
          remark: stagedItem.remark,
          optionLabel: stagedItem.optionLabel,
          optionLabelFormat: stagedItem.optionLabelFormat,
          maintenanceAdvice: stagedItem.maintenanceAdvice,
          constructionJobId: stagedItem.constructionJobId,
          isCustom: stagedItem.isCustom,
          result: stagedItem.result,
          medias: stagedItem.medias.map(mediaStagedToCommitPayload),
        });
      } else {
        // custom issue.
        customIssues.push({
          id: stagedItem.id,
          inspectionType: this.inspectionType,
          siteId: this.site.id,
          siteName: this.site.name,
          itemId: undefined,
          itemName: stagedItem.name,
          abnormalLevel: stagedItem.abnormalLevel,
          severityLevel: stagedItem.severityLevel,
          technicianId: this.technicianId,
          technicianName: this.technicianName,
          siteInfluenceFactor: stagedItem.siteInfluenceFactor,
          itemInfluenceFactor: stagedItem.itemInfluenceFactor,
          inspectionResult: stagedItem.inspectionResult,
          referenceState: stagedItem.referenceState,
          maintenanceAdvice: stagedItem.maintenanceAdvice,
          description: stagedItem.remark,
          medias: stagedItem.medias.map(mediaStagedToCommitPayload),
        });
      }
    }
    const payload: SiteInspectionCommitPayload = {
      id: staged.id,
      siteId: this.site.id,
      commitId: staged.commitId,
      inspectionType: this.inspectionType,
      technicianId: this.technicianId,
      technicianName: this.technicianName,
      abnormalLevel,
      severityLevel,
      extraData: staged.extraData,
      remark: staged.remark,
      items,
      customIssues,
    };
    this.inspectionManager.siteInspectionWillCommit(this.site.id);
    try {
      const res = await this.taskService.commitSiteInspection(
        this.taskNo,
        payload,
      );
      this.handleVersionedResponse(
        res,
        (_, { inspection, original, response }) => {
          const index = original.sites.findIndex(
            x => x.siteId === this.site.id,
          );
          if (index < 0) {
            inspection.sites.push(response);
          } else {
            inspection.sites[index] = response;
          }
        },
      );
      const nextStaged = this.toStaged(res.response);
      this.staged$.next(nextStaged);
    } finally {
      this.inspectionManager.siteInspectionDidCommit(this.site.id);
    }
  }

  produce(
    recipe: (
      draft: WritableDraft<SiteInspectionStaged>,
      original: SiteInspectionStaged,
    ) => void,
  ) {
    const current = freeze(this.staged$.getValue());
    const nextState = produce(current, draft => {
      recipe(draft, current);
    });
    this.staged$.next(nextState);
  }

  produceItem(
    key: string,
    recipe: (
      draft: WritableDraft<SiteInspectionItemStaged>,
      original: SiteInspectionItemStaged,
      originalState: SiteInspectionStaged,
      index: number,
    ) => void,
  ) {
    const current = this.staged$.getValue();
    const index = current.items.findIndex(x => x._key === key);
    if (index < 0) {
      console.error('Cannot find check item, this must be bug');
      return;
    } else {
      this.produceItemAt(index, recipe);
    }
  }

  produceItemAt(
    index: number,
    recipe: (
      draft: WritableDraft<SiteInspectionItemStaged>,
      original: SiteInspectionItemStaged,
      originalState: SiteInspectionStaged,
      index: number,
    ) => void,
  ) {
    this.produce((draft, original) => {
      const item = draft.items[index];
      recipe(item, original.items[index], original, index);
    });
  }

  private onFileUploadEvent(
    e: MediaUploadTaskEvent,
    task: Immutable<MediaUploadTask<TaskFileUploadRequestContext>>,
  ) {
    const request = task.request;
    const context = request.context;

    // ignore unwanted event that is not specific to me.
    if (
      context == null ||
      context.type !== 'item-inspection' ||
      context.siteInspectionManagerId !== this.id ||
      context.siteId !== this.site.id
    ) {
      return;
    }

    if (e.type === 'queued') {
      // add a new media state when queued.
      this.produceItem(context.key, (draft, original) => {
        if (context.mediaKey) {
          const index = original.medias.findIndex(
            x => x._key === context.mediaKey,
          );
          if (index >= 0) {
            const media = draft.medias[index];
            media.annotationMetadata = context.annotationMetadata as any;
            media._source = {
              type: 'local',
              localFileUri: request.localFileUri,
              state: { status: 'queued' },
            };
            return;
          }
        }

        draft.medias.push({
          type: request.contentType,
          annotationMetadata: context.annotationMetadata as any,
          _key: task.key,
          _source: {
            type: 'local',
            localFileUri: request.localFileUri,
            state: { status: 'queued' },
          },
        });
      });
    } else {
      // update the existing media state.
      this.produceItem(context.key, (draft, original) => {
        // use original item to speed up searching
        const index = original.medias.findIndex(
          x => x._key === (context.mediaKey ?? task.key),
        );
        if (index < 0) return;
        const media = draft.medias[index];
        if (media._source.type !== 'local') return;
        switch (e.type) {
          case 'progress': {
            media._source.state = { status: 'uploading', progress: e.progress };
            return;
          }
          case 'error': {
            media._source.state = { status: 'error', error: e.error };
            return;
          }
          case 'finished': {
            const cover = e.result.extra?.cover;
            media.coverUrl = cover != null && cover !== '' ? cover : undefined;
            media._source.state = { status: 'uploaded', result: e.result };
            return;
          }
          default:
            return;
        }
      });
    }
  }

  private makeInitialInspectedItemStaged(
    item: InspectionItemInfo,
  ): SiteInspectionItemStaged {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let result: SiteInspectionItemResult;
    if (
      item.valueType != null &&
      isSimpleNumericInspectionResultDataType(item.valueType)
    ) {
      result = {
        valueType: item.valueType,
        unit: item.valueUnit ?? undefined,
      };
    } else if (
      item.valueType != null &&
      isComplexInspectionResultDataType(item.valueType)
    ) {
      result = {
        valueType: item.valueType,
        data: '',
      };
    } else {
      result = {
        valueType: OptionValueType.String,
        value: '',
      };
    }
    return {
      _key: nanoid(),
      type: 'item',
      itemId: item.id,
      name: item.name,
      abnormalLevel: AbnormalLevel.Fine,
      severityLevel: SeverityLevel.None,
      isCustom: false,
      result,
      medias: [],
    };
  }

  private toStaged(
    siteInspection: SiteInspection | undefined,
  ): SiteInspectionStaged {
    const inspectedItemMapByItemId = array2map(
      siteInspection?.items ?? [],
      x => x.itemId,
    );
    const items = this.site.checkItems.map(checkItem => {
      const inspectedItem = inspectedItemMapByItemId.get(checkItem.id);
      if (inspectedItem) {
        return siteInspectionItemToStaged(inspectedItem);
      }
      return this.makeInitialInspectedItemStaged(checkItem);
    });
    if (siteInspection?.customIssues?.length) {
      for (const customIssue of siteInspection.customIssues) {
        items.push(siteCustomIssueToStaged(customIssue));
      }
    }
    return {
      id: siteInspection?.id,
      siteId: siteInspection?.siteId ?? this.site.id,
      commitId: siteInspection?.commitId,
      inspectionType: siteInspection?.inspectionType ?? this.inspectionType,
      technicianId: siteInspection?.technicianId ?? this.technicianId,
      technicianName: siteInspection?.technicianName ?? this.technicianName,
      abnormalLevel: siteInspection?.abnormalLevel ?? AbnormalLevel.Fine,
      severityLevel: siteInspection?.severityLevel ?? SeverityLevel.None,
      extraData: siteInspection?.extraData,
      remark: siteInspection?.remark,
      items,
    };
  }
}

//#region helpers

const toMediaStaged = <T extends AnyMedia>(media: T): TaskMediaStaged => {
  return {
    _key: nanoid(),
    id: media.id,
    type: media.type,
    coverUrl: media.coverUrl,
    title: media.title,
    subTitle: media.subTitle,
    remark: media.remark,
    annotationMetadata: media.annotationMetadata
      ? JSON.parse(media.annotationMetadata)
      : undefined,
    _source: { type: 'remote', url: media.url, cid: media.cid },
  };
};

const siteInspectionItemToStaged = (
  item: SiteInspectionItem,
): SiteInspectionItemStaged => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let result: SiteInspectionItemResult;
  if (isSimpleNumericInspectionResultDataType(item.resultDataType)) {
    result = {
      valueType: item.resultDataType,
      value: item.resultDataNumberValue ?? 0,
      unit: item.resultDataUnit,
      range: {
        lower: item.optionLower,
        upper: item.optionUpper,
        lowerInclusive: item.optionLowerInclusive,
        upperInclusive: item.optionUpperInclusive,
      },
    } as SiteInspectionItemNumericResult;
  } else if (isSimpleStringInspectionResultDataType(item.resultDataType)) {
    result = {
      valueType: item.resultDataType,
      value: item.resultDataStringValue,
    } as SiteInspectionItemStringResult;
  } else {
    result = {
      valueType: item.resultDataType,
      data: '', // not implemented.
    } as SiteInspectionItemComplexResult;
  }
  return {
    _key: nanoid(),
    type: 'item',
    id: item.id,
    name: item.name,
    label: item.label,
    remark: item.remark,
    abnormalLevel: item.abnormalLevel,
    severityLevel: item.severityLevel,

    itemId: item.itemId,
    optionLabel: item.optionLabel,
    optionLabelFormat: item.optionLabelFormat,
    maintenanceAdvice: item.maintenanceAdvice,
    description: item.resultDescription,
    constructionJobId: item.constructionJobId,
    isCustom: item.isCustom,
    result,

    medias: item.medias.map(toMediaStaged),
  };
};

const siteCustomIssueToStaged = (
  customIssue: SiteCustomIssue,
): SiteInspectionItemStaged => {
  return {
    _key: nanoid(),
    id: customIssue.id,
    type: 'customIssue',
    name: customIssue.itemName,
    label: customIssue.label,
    remark: customIssue.description,
    abnormalLevel: customIssue.abnormalLevel,
    severityLevel: customIssue.severityLevel,

    referenceState: customIssue.referenceState,
    inspectionResult: customIssue.inspectionResult,
    maintenanceAdvice: customIssue.maintenanceAdvice,
    siteInfluenceFactor: customIssue.siteInfluenceFactor,
    itemInfluenceFactor: customIssue.itemInfluenceFactor,
    technicianId: customIssue.technicianId,
    technicianName: customIssue.technicianName,

    medias: customIssue.medias.map(toMediaStaged),
  };
};

const mediaStagedToCommitPayload = (
  media: TaskMediaStaged,
): TaskMediaCommitPayload => {
  let url = '';
  if (media._source.type === 'local') {
    if (media._source.state.status === 'uploaded') {
      url = media._source.state.result.url;
    } else {
      throw new Error('Cannot save with pending medias');
    }
  } else {
    url = media._source.url;
  }
  return {
    id: media.id,
    type: media.type,
    url,
    coverUrl: media.coverUrl,
    title: media.title,
    subTitle: media.subTitle,
    remark: media.remark,
    annotationMetadata: media.annotationMetadata
      ? JSON.stringify(media.annotationMetadata)
      : undefined,
  };
};

//#endregion
