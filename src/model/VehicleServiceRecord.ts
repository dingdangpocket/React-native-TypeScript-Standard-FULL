/**
 * @file: VehicleServiceRecord.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { VehicleBindingCriterion } from '@euler/model';
import { Range } from '@euler/model/common';
import {
  AbnormalLevel,
  InspectionTaskEventDataType,
  InspectionTaskEventSubType,
  InspectionTaskEventType,
  InspectionTaskTroubleCodeState,
  SeverityLevel,
  SiteInspectionType,
} from '@euler/model/enum';

export enum VehicleServiceRecordType {
  System = 'system',
  User = 'user',
}

export interface VehicleServiceItem {
  name: string;
  label: string | null;
  remark: string | null;
  groupName: string | null;
  teamName: string | null;
}

export interface VehicleServiceEvent {
  id: string;
  type: InspectionTaskEventType;
  subType: InspectionTaskEventSubType;
  timestamp: Date;
  data: string | null;
  dataType: InspectionTaskEventDataType;
  dataVersion: number;
  author: string | null;
}

export interface VehicleServiceTroubleCode {
  sourceModule: string;
  sourceModuleName: string;
  code: string | null;
  description: string | null;
  status: InspectionTaskTroubleCodeState | null;
  statusText: string | null;
}

export interface VehicleServicePendingIssue {
  title: string;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
  inspectionType: SiteInspectionType;
  siteId: number | null;
  siteName: string | null;
  siteCode: string | null;
  itemName: string | null;
  itemId: number | null;
  customIssueId: number | null;
  maintenanceAdvice: string | null;
}

export interface VehicleServiceRecordUserMedia {
  id: string;
  type: string;
  label: string | null;
  url: string;
  coverUrl: string;
  tag: string | null;
}

export interface VehicleServiceComment {
  score: number;
  serviceAttitudeScore: number;
  serviceEfficiencyScore: number;
  professionalDegreeScore: number;
  satisfactionDegreeScore: number;
  comment: string | null;
  timestamp: Date;
}

export interface CustomVehicleServiceRecordInfo {
  serviceDate: string;
  licensePlateNo: string;
  vin: string;
  storeName: string;
  mileage: number;
  totalCost?: number | null;
  items: VehicleServiceItem[];
  userMedias: VehicleServiceRecordUserMedia[];
}

export interface VehicleServiceRecord {
  _id: string;
  type: VehicleServiceRecordType;
  licensePlateNo: string;
  vin: string;
  orgId: number;
  storeId: number;
  organizationName: string | null;
  storeName: string | null;
  serviceAgentName: string;
  orderNo: string;
  taskNo: string;
  reportNo: string;
  vehicleName: string;
  vehicleBrand: string;
  mileage: number;
  serviceTime: string | Date;
  orderedAt: string | Date;
  finishedAt: string | Date;
  createdAt: string | Date;
  items: VehicleServiceItem[] | null;
  events: VehicleServiceEvent[] | null;
  userMedias: VehicleServiceRecordUserMedia[] | null;
  troubleCodes: VehicleServiceTroubleCode[] | null;
  pendingIssues: VehicleServicePendingIssue[] | null;
  remark: string | null;
  totalCost: number | null;
  comment: VehicleServiceComment | null;
}

export interface VehicleServiceRecordFilter {
  type: VehicleServiceRecordType;
  licensePlateNo: string;
  vehicleBindings: VehicleBindingCriterion[];
  vin: string;
  orgId: number;
  storeId: number;
  orderNo: string;
  taskNo: string;
  reportNo: string;
  mileage: number;
  mileageRange: Range<number>;
  serviceTime: Range<string | Date>;
  orderedAt: Range<string | Date>;
  finishedAt: Range<string | Date>;
  createdAt: Range<string | Date>;
}

export interface VehicleServiceRecordProjection {
  items: boolean;
  events: boolean;
  userMedias: boolean;
  troubleCodes: boolean;
  pendingIssues: boolean;
  comment: boolean;
}
