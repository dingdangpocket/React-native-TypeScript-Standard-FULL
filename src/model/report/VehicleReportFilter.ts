/**
 * @file: VehicleReportFilter.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { Range } from '../common';
import { InspectionOrderType } from '../enum';
import { ReportStatus } from './ReportStatus';
import { VehicleReport } from './VehicleReport';

export interface VehicleReportVehicleBindingCriterion {
  licensePlateNo: string;
  vin: string;
}

export interface VehicleReportFilter {
  reportNo: string;
  orgId: number;
  storeId: number;
  licensePlateNo: string;
  vin: string;
  serviceAgentId: number;
  serviceAgentName: string;
  orderType: InspectionOrderType;
  vehicleName: string;
  vehicleBrandName: string;
  orderedAt: Range<Date | string>;
  createdAt: Range<Date | string>;
  updatedAt: Range<Date | string>;
  finishedAt: Range<Date | string>;
  vehicleBindings: VehicleReportVehicleBindingCriterion[];
  status: ReportStatus;
}

export type VehicleReportSortProperty = Extract<
  keyof VehicleReport,
  'orderedAt' | 'createdAt' | 'updatedAt' | 'finishedAt'
>;

export interface VehicleReportSort {
  prop: VehicleReportSortProperty;
  dir: 'asc' | 'desc';
}

export interface VehicleReportProjection {
  preInspection?: boolean;
  inspection?: boolean;
  diagnostic?: boolean;
  construction?: boolean;
  quotation?: boolean;
  deliveryCheck?: boolean;
  obdInspection?: boolean;
  changes?: boolean;
}

export const VehicleReportDetailDefaultProjection: VehicleReportProjection = {
  preInspection: true,
  inspection: true,
  diagnostic: true,
  construction: true,
  quotation: true,
  deliveryCheck: true,
  changes: false,
};
