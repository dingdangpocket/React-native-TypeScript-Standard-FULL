/**
 * @file: VehicleInspectionTask.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import {
  CommonTaskStatus,
  InspectionOrderPriority,
  InspectionOrderType,
  InspectionTaskStatus,
  QuotationStatus,
} from '../enum';
import { Organization } from './Organization';
import { Store } from './Store';
import { VehicleInspectionTaskCheckSite } from './VehicleInspectionTaskCheckSite';
import { VehicleInspectionTaskCustomIssue } from './VehicleInspectionTaskCustomIssue';
import { VehicleInspectionTaskSubject } from './VehicleInspectionTaskSubject';
import { VehicleInspectionTaskTroubleCode } from './VehicleInspectionTaskTroubleCode';

export interface VehicleInspectionTask {
  id: number;
  taskNo: string;
  orgId: number;
  storeId: number;
  orderId: number;
  orderNo: string;
  orderType: InspectionOrderType;
  reportNo: string;
  vin: string;
  licensePlateNo: string;
  vehicleName: string;
  vehicleBrandName: string;
  vehicleManufacturer?: string | null;
  vehicleModel: string;
  vehicleModelYear?: number | null;
  vehicleDisplacement?: string | null;
  vehicleTrimLevel?: string | null;
  vehicleFuelType?: string | null;
  vehicleMileage: number;
  priority?: InspectionOrderPriority | null;
  expectedDuration?: number | null;
  serviceAgentId?: number | null;
  serviceAgentName: string;
  status: InspectionTaskStatus;
  preInspectionStatus: CommonTaskStatus;
  inspectionStatus: CommonTaskStatus;
  diagnosticStatus: CommonTaskStatus;
  quotationStatus: QuotationStatus;
  constructionStatus: CommonTaskStatus;
  deliveryCheckStatus: CommonTaskStatus;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  startedAt?: string | Date | null;
  isObdInspected: boolean;
  preInspectedBy?: string | null;
  preInspectedAt?: string | Date | null;
  inspectedBy?: string | null;
  inspectedAt?: string | Date | null;
  diagnosedBy?: string | null;
  diagnosedAt?: string | Date | null;
  quotedAt?: string | Date | null;
  constructedBy?: string | null;
  constructedAt?: string | Date | null;
  deliveryCheckedBy?: string | null;
  deliveryCheckedAt?: string | Date | null;
  finishedBy?: string | null;
  finishedAt?: string | Date | null;
  suspendedAt?: string | Date | null;
  elapsedTime?: number | null;
  isCancellationRequested?: boolean | null;
  isConstructionJobScheduled: boolean;
  constructionJobScheduledAt?: string | Date | null;
  isPendingIssuesConfirmed: boolean;
  pendingIssuesConfirmedAt?: string | Date | null;
  obdInspectedBy?: string | null;
  obdInspectedAt?: string | Date | null;
  quotationFormId?: number | null;
  quotationFormNo?: string | null;
  vinImgUrl?: string | null;
  licensePlateNoImgUrl?: string | null;
  dashboardImgUrl?: string | null;
  totalSiteCount: number;
  totalItemCount: number;
  normalSiteCount: number;
  normalItemCount: number;
  abnormalSiteCount: number;
  abnormalItemCount: number;
  urgentSiteCount: number;
  urgentItemCount: number;
  hasOilService: boolean;
  nextServiceMileage?: number | null;
  nextServiceDate?: string | Date | null;
  preInspectionScore?: number | null;
  inspectionScore?: number | null;
  score?: number | null;
  remark?: string | null;
  preInspectionSignatureImgUrl?: string | null;
  preInspectionSignedAt?: string | Date | null;
  deliveryCheckSignatureImgUrl?: string | null;
  deliveryCheckSignedAt?: string | Date | null;
  totalCoveredPreSiteCount: number;
  totalCoveredPreItemCount: number;
  totalCoveredSiteCount: number;
  totalCoveredItemCount: number;
  inspectedSites?: VehicleInspectionTaskCheckSite[];
  customIssues?: VehicleInspectionTaskCustomIssue[];
  troubleCodes?: VehicleInspectionTaskTroubleCode[];
  org?: Organization;

  // flattened fields from associated Organization
  organizationName?: string;
  store?: Store;

  // flattened fields from associated Store
  storeName?: string;
  subjects?: VehicleInspectionTaskSubject[];

  // extra properties defined in codegen.yaml

  // vehicle brand logo
  vehicleBrandLogo?: string | null;

  // vehicle image
  vehicleImageUrl?: string | null;

  // task url for customer
  url?: string | null;

  // task url for org
  privateUrl?: string | null;

  // represents weixin bindings of the customer of the task
  customerWxBindings?: string[] | null;

  // represents the customer observations
  observes?: string[] | null;
}
