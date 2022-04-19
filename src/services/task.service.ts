/**
 * @file: task.service.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { EnvTagType } from '@euler/config';
import { HttpClient } from '@euler/lib/request';
import {
  ConstructionWorkItem,
  DeliveryCheckWorkItem,
  InspectedItemLabel,
  InspectionFlowSummary,
  UpdateTaskInformation,
  VehicleInspectionFlow,
  VehicleIssuesFilter,
  VehicleServiceRecordsFilter,
} from '@euler/model';
import {
  VehicleInspectionTask,
  VehicleInspectionTaskEvent,
  VehicleInspectionTaskTroubleCode,
} from '@euler/model/entity';
import {
  InspectionCategory,
  SiteInspectionType,
  SubscribeBindActionType,
} from '@euler/model/enum';
import { VehicleReport, VehicleReportProjection } from '@euler/model/report';
import {
  Construction,
  ConstructionJob,
  ConstructionJobCommitPayload,
  CustomIssue,
  CustomIssueCommitPayload,
  DeliveryCheck,
  DeliveryCheckItem,
  DeliveryCheckItemCommitPayload,
  InspectionDetail,
  SiteInspection,
  SiteInspectionCommitPayload,
  TaskBasicInfo,
  TaskDetail,
  TaskDetailProjection,
  TaskDetailVersionKey,
  TaskDetailVersions,
  VersionedResponse,
} from '@euler/model/task-detail';
import {
  ObdTroubleCode,
  ObdTroubleCodeCommitPayload,
} from '@euler/model/task-detail/ObdTroubleCode';
import { ReportTabKey } from '@euler/model/viewmodel';
import { getCommonRequestParametersAsSearchQuery } from '@euler/services/utils';
import { formatDate } from '@euler/utils/formatters/datetime';

export class TaskService {
  constructor(private readonly api: HttpClient) {}

  //#region basic

  async list(
    startDate: string | Date,
    endDate: string | Date,
    offset: number,
    limit: number,
  ): Promise<VehicleInspectionTask[]> {
    return await this.api
      .get()
      .url('/tasks', {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        offset,
        limit,
      })
      .future();
  }

  async getTaskDetail(
    taskNo: string,
    options?: {
      projection?: TaskDetailProjection;
      projectionByVersions?: { [p in TaskDetailVersionKey]?: number };
    },
  ): Promise<VersionedResponse<TaskDetail>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/detail', {
        taskNo,
      })
      .data(options)
      .future();
  }

  async getTaskDetailVersions(taskNo: string): Promise<TaskDetailVersions> {
    return await this.api
      .get()
      .url('/tasks/:taskNo/detail/versions', {
        taskNo,
      })
      .future();
  }

  async getTaskExtraInfo(
    taskId: number,
    options?: {
      issuesFilter?: VehicleIssuesFilter;
      serviceRecordsFilter?: VehicleServiceRecordsFilter;
    },
  ): Promise<TaskDetail> {
    return await this.api
      .post()
      .url('/vehicle-inspection-tasks/:taskId/extra-info', {
        taskId,
      })
      .data(options ?? {})
      .future();
  }

  async updateTaskInformation(
    taskNo: string,
    payload: UpdateTaskInformation,
  ): Promise<VersionedResponse<void>> {
    return await this.api
      .patch()
      .url('/tasks/:taskNo', { taskNo })
      .data({ payload })
      .future();
  }

  async cancelTask(
    taskNo: string,
    options?: {
      remark?: string;
    },
  ): Promise<VersionedResponse<TaskBasicInfo>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/cancel', { taskNo })
      .data(options)
      .future();
  }

  async finishTask(
    taskNo: string,
    options?: {
      remark?: string;
    },
  ): Promise<VersionedResponse<TaskBasicInfo>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/finish', { taskNo })
      .data(options)
      .future();
  }

  //#endregion

  //#region obd diagnostics

  async listTaskTroubleCodes(
    taskNo: string,
  ): Promise<VehicleInspectionTaskTroubleCode[]> {
    return await this.api
      .get()
      .url('/tasks/:taskNo/trouble-codes', { taskNo })
      .future();
  }

  async insertTaskTroubleCodes(
    taskNo: string,
    troubleCodes: Partial<VehicleInspectionTaskTroubleCode>[],
  ): Promise<VehicleInspectionTaskTroubleCode[]> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/trouble-codes', { taskNo })
      .data(troubleCodes)
      .future();
  }

  async removeTaskTroubleCodes(
    taskNo: string,
    codes: string[],
  ): Promise<VehicleInspectionTaskTroubleCode[] | undefined> {
    return await this.api
      .delete()
      .url('/tasks/:taskNo/trouble-codes', { taskNo })
      .data(codes)
      .future();
  }
  //#endregion

  //#region inspection flows

  async getTaskInspectionFlows(
    category: InspectionCategory,
    taskNo: string,
  ): Promise<VersionedResponse<VehicleInspectionFlow[]>> {
    return await this.api
      .get()
      .url('/tasks/:taskNo/inspections/flows', { category, taskNo })
      .future();
  }

  async getTaskInspectionFlowInfo(
    category: InspectionCategory,
    taskNo: string,
    id: string,
  ): Promise<VehicleInspectionFlow> {
    return await this.api
      .get()
      .url('/tasks/:taskNo/inspections/flows/:id', { category, taskNo, id })
      .future();
  }

  /**
   * this method is idemponent, which means you can call this method with
   * the same parameters many times without errors.
   */
  async addTaskInspectionFlow(
    taskNo: string,
    params: {
      category: InspectionCategory;
      templateId: number;
      assignToMemberId: number;
    },
  ): Promise<VersionedResponse<VehicleInspectionFlow>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/inspections/flows', { taskNo })
      .data(params)
      .future();
  }

  async beginTaskInspectionFlow(
    taskNo: string,
    category: InspectionCategory,
    id: string,
  ): Promise<VersionedResponse<VehicleInspectionFlow>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/inspections/flows/:id/begin', { taskNo, id })
      .data({
        category,
      })
      .future();
  }

  async finishTaskInspectionFlow(
    category: InspectionCategory,
    taskNo: string,
    id: string,
    summary: InspectionFlowSummary,
    options?: {
      technicianId?: number;
      technicianName?: string;
      labels?: InspectedItemLabel[];
      remark?: string;
    },
  ): Promise<VersionedResponse<VehicleInspectionFlow>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/inspections/flows/:id/finish', { taskNo, id })
      .data({
        category,
        summary,
        ...options,
      })
      .future();
  }

  //#endregion

  //#region inspections

  async getTaskInspectionDetail(
    taskNo: string,
    category: InspectionCategory,
    options: {
      types?: SiteInspectionType[];
      recursive?: boolean;
    },
  ): Promise<VersionedResponse<InspectionDetail>> {
    return await this.api
      .get()
      .url('/tasks/:taskNo/inspections/detail', {
        taskNo,
        category,
        types: options?.types?.join(','),
        recursive: options?.recursive,
      })
      .future();
  }

  async getSiteInspectionDetail(
    taskNo: string,
    siteId: number,
  ): Promise<VersionedResponse<SiteInspection | null>> {
    return await this.api
      .get()
      .url('/tasks/:taskNo/inspections/sites/:siteId', {
        taskNo,
        siteId,
      })
      .future();
  }

  async commitSiteInspection(
    taskNo: string,
    payload: SiteInspectionCommitPayload,
    options?: {
      simulateError?: boolean;
    },
  ): Promise<VersionedResponse<SiteInspection>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/inspections/sites/:siteId/commits', {
        taskNo,
        siteId: payload.siteId,
        simulate_error: options?.simulateError,
      })
      .data({ payload })
      .future();
  }

  async saveCustomIssue(
    taskNo: string,
    payload: CustomIssueCommitPayload,
  ): Promise<VersionedResponse<CustomIssue>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/inspections/custom-issues', { taskNo })
      .data({ payload })
      .future();
  }

  async deleteCustomIssue(
    taskNo: string,
    issueId: number,
  ): Promise<VersionedResponse<void>> {
    return await this.api
      .delete()
      .url('/tasks/:taskNo/inspections/custom-issues/:issueId', {
        taskNo,
        issueId,
      })
      .future();
  }

  async cancelSiteInspection(
    taskNo: string,
    siteId: number,
  ): Promise<VersionedResponse<void>> {
    return await this.api
      .delete()
      .url('/tasks/:taskNo/inspections/sites/:siteId', { taskNo, siteId })
      .future();
  }

  async requestAmendInspectionResults(
    taskNo: string,
    category: InspectionCategory,
    options?: {
      technicianId?: number;
      technicianName?: string;
    },
  ): Promise<VersionedResponse<void>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/inspections/results/amends', {
        taskNo,
      })
      .data({ category, ...options })
      .future();
  }

  async finishInspections(
    taskNo: string,
    category: InspectionCategory,
    options?: {
      labels?: InspectedItemLabel[] | null;
      technicianId?: number;
      technicianName?: string;
      remark?: string;
    },
  ): Promise<VersionedResponse<void>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/inspections/finish', {
        taskNo,
      })
      .data({ category, ...options })
      .future();
  }

  async cancelInspections(
    taskNo: string,
    category: InspectionCategory,
    options?: {
      technicianId?: number;
      technicianName?: string;
    },
  ): Promise<VersionedResponse<void>> {
    return await this.api
      .delete()
      .url('/tasks/:taskNo/inspections', {
        taskNo,
      })
      .data({ category, ...options })
      .future();
  }

  async listObdTroubleCodes(
    taskNo: string,
  ): Promise<VersionedResponse<ObdTroubleCode[]>> {
    return await this.api
      .get()
      .url('/tasks/:taskNo/inspections/obd/trouble-codes', { taskNo })
      .future();
  }

  async saveObdTroubleCodes(
    taskNo: string,
    payloads: ObdTroubleCodeCommitPayload[],
  ): Promise<VersionedResponse<ObdTroubleCode[]>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/inspections/obd/trouble-codes', { taskNo })
      .data({ payloads })
      .future();
  }

  async removeObdTroubleCodes(
    taskNo: string,
    codes: string[],
  ): Promise<VersionedResponse<void>> {
    return await this.api
      .delete()
      .url('/tasks/:taskNo/inspections/obd/trouble-codes', { taskNo })
      .data({ codes })
      .future();
  }

  //#endregion

  //#region constructions

  async fetchConstructionWorkItems(
    taskNo: string,
  ): Promise<ConstructionWorkItem[]> {
    return await this.api
      .get()
      .url('/tasks/:taskNo/constructions/work-items', { taskNo })
      .future();
  }

  async getConstructionDetail(
    taskNo: string,
  ): Promise<VersionedResponse<Construction>> {
    return await this.api
      .get()
      .url('/tasks/:taskNo/constructions/detail', { taskNo })
      .future();
  }

  async addCustomConstructionJob(
    taskNo: string,
    name: string,
    technicianId?: number,
    technicianName?: string,
  ): Promise<VersionedResponse<ConstructionJob>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/constructions/custom-jobs', { taskNo })
      .data({ name, technicianId, technicianName })
      .future();
  }

  async updateConstructionJobName(
    taskNo: string,
    jobId: number,
    name: string,
  ): Promise<VersionedResponse<void>> {
    return await this.api
      .put()
      .url('/tasks/:taskNo/constructions/jobs/:jobId/name', { taskNo, jobId })
      .data({ name })
      .future();
  }

  async scheduleConstructionJobs(
    taskNo: string,
    workItems: ConstructionWorkItem[],
    technicianId?: number,
    technicianName?: string,
  ): Promise<VersionedResponse<ConstructionJob[]>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/constructions/jobs', { taskNo })
      .data({ workItems, technicianId, technicianName })
      .future();
  }

  async getConstructionJobDetail(
    taskNo: string,
    jobId: number,
  ): Promise<VersionedResponse<ConstructionJob>> {
    return await this.api
      .get()
      .url('/tasks/:taskNo/constructions/jobs/:jobId', { taskNo, jobId })
      .future();
  }

  async beginScheduledConstructionJob(
    taskNo: string,
    jobId: number,
    technicianId?: number,
    technicianName?: string,
  ): Promise<VersionedResponse<ConstructionJob>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/constructions/jobs/:jobId/begin', { taskNo, jobId })
      .data({ technicianId, technicianName })
      .future();
  }

  async deleteScheduledConstructionJob(
    taskNo: string,
    jobId: number,
    technicianId?: number,
    technicianName?: string,
  ): Promise<VersionedResponse<void>> {
    return await this.api
      .delete()
      .url('/tasks/:taskNo/constructions/jobs/:jobId', { taskNo, jobId })
      .data({ technicianId, technicianName })
      .future();
  }

  async commitScheduledConstructionJob(
    taskNo: string,
    payload: ConstructionJobCommitPayload,
  ): Promise<VersionedResponse<ConstructionJob>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/constructions/jobs/:jobId/commits', {
        taskNo,
        jobId: payload.id,
      })
      .data({ payload })
      .future();
  }

  async finishConstructionJobs(
    taskNo: string,
    remark?: string,
  ): Promise<VersionedResponse<void>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/constructions/jobs/finish', {
        taskNo,
      })
      .data({ remark })
      .future();
  }

  async requestUpdateConstructionJobs(
    taskNo: string,
  ): Promise<VersionedResponse<void>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/constructions/jobs/amends', {
        taskNo,
      })
      .future();
  }

  async cancelConstructions(taskNo: string): Promise<void> {
    await this.api
      .delete()
      .url('/tasks/:taskNo/constructions', {
        taskNo,
      })
      .future();
  }

  //#endregion

  //#region delivery checks

  async confirmPendingIssues(taskNo: string): Promise<VersionedResponse<void>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/delivery-checks/confirm-pending-issues', { taskNo })
      .future();
  }

  async getDeliveryCheckWorkItems(
    taskNo: string,
  ): Promise<DeliveryCheckWorkItem[]> {
    return await this.api
      .get()
      .url('/tasks/:taskNo/delivery-checks/work-items', { taskNo })
      .future();
  }

  async getDeliveryCheckDetail(
    taskNo: string,
  ): Promise<VersionedResponse<DeliveryCheck>> {
    return await this.api
      .get()
      .url('/tasks/:taskNo/delivery-checks/detail', { taskNo })
      .future();
  }

  async commitDeliveryCheck(
    taskNo: string,
    payload: DeliveryCheckItemCommitPayload,
    technicianId?: number,
    technicianName?: string,
  ): Promise<VersionedResponse<DeliveryCheckItem>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/delivery-checks', { taskNo })
      .data({ payload, technicianId, technicianName })
      .future();
  }

  async batchCommitDeliveryChecks(
    taskNo: string,
    payload: DeliveryCheckItemCommitPayload[],
    technicianId?: number,
    technicianName?: string,
  ): Promise<VersionedResponse<DeliveryCheckItem[]>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/delivery-checks/batch-commits', { taskNo })
      .data({ payload, technicianId, technicianName })
      .future();
  }

  async completeDeliveryChecksAndFinishTask(
    taskNo: string,
    remark?: string,
    signatureImgUrl?: string,
  ): Promise<VersionedResponse<void>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/delivery-checks/finish', { taskNo })
      .data({ remark, signatureImgUrl })
      .future();
  }

  async requestUpdateDeliveryChecks(
    taskNo: string,
  ): Promise<VersionedResponse<void>> {
    return await this.api
      .post()
      .url('/tasks/:taskNo/delivery-checks/amends', { taskNo })
      .future();
  }

  async deleteDeliveryCheck(
    taskNo: string,
    id: number,
  ): Promise<VersionedResponse<void>> {
    return await this.api
      .delete()
      .url('/tasks/:taskNo/delivery-checks/:id', { taskNo, id })
      .future();
  }

  async cancelDeliveryChecks(taskNo: string): Promise<VersionedResponse<void>> {
    return await this.api
      .delete()
      .url('/tasks/:taskNo/delivery-checks', { taskNo })
      .future();
  }

  //#endregion

  async getTaskTimeline(
    taskNo: string,
    limit?: number,
  ): Promise<VehicleInspectionTaskEvent[]> {
    return await this.api
      .get()
      .url('/tasks/:taskNo/timeline', { taskNo, limit })
      .future();
  }

  async getReportWithPendingData(
    taskNo: string,
    projection: VehicleReportProjection,
  ): Promise<VehicleReport> {
    return await this.api
      .get()
      .url('/tasks/:taskNo/report-with-pending-data', { taskNo, ...projection })
      .future();
  }

  async getMiniprogramReportSharingParams(
    taskNo: string,
    params?: {
      tab?: ReportTabKey;
      shareType?: 'sa';
      envTag?: EnvTagType;
      openid?: string;
    },
  ): Promise<{
    appid: string;
    userName: string;
    pagePath: string;
  }> {
    return await this.api
      .get()
      .url('/weixin/miniprogram/sharing/report', {
        taskno: taskNo,
        openid: params?.openid,
        tab: params?.tab,
        share_type: params?.shareType,
        env_tag: params?.envTag,
      })
      .future();
  }

  async getSubscribeBindQrcodeImageUrl(
    taskNo: string,
    options?: {
      logo?: boolean;
      size?: number;
      action?: SubscribeBindActionType;
      __fake__?: boolean;
    },
  ): Promise<string> {
    const commonSearchQuery = await getCommonRequestParametersAsSearchQuery();
    return this.api.url('tasks/:taskNo/subscribe-bind/qrcode.png', {
      taskNo,
      ...options,
      ...commonSearchQuery,
    });
  }

  async notifyServiceUpdated(
    taskNo: string,
    options?: {
      title?: string;
      detail?: string;
      remark?: string;
      reportTab?: ReportTabKey;
    },
  ): Promise<void> {
    await this.api
      .post()
      .url('/tasks/:taskNo/notifications/service-updated', { taskNo })
      .data(options ?? {})
      .future();
  }
}
