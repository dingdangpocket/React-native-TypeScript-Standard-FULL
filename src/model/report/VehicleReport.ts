/**
 * @file: VehicleReport.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { InspectionOrderType } from '../enum';
import { ConstructionReport } from './ConstructionReport';
import { DeliveryCheckReport } from './DeliveryCheckReport';
import { DiagnosticReport } from './DiagnosticReport';
import { InspectionReport, PreInspectionReport } from './InspectionReport';
import { ObdInspectionReport } from './ObdInspectionReport';
import { QuotationReport } from './QuotationReport';
import { ReportStatus } from './ReportStatus';
import { VehicleReportChange } from './VehicleReportChange';

export type ReportDocType = Extract<
  keyof VehicleReport,
  | 'preInspection'
  | 'inspection'
  | 'diagnostic'
  | 'quotation'
  | 'construction'
  | 'deliveryCheck'
>;

export interface VehicleReport {
  _id: string;
  orgId: number;
  orgName: string;
  storeId: number;
  storeName: string;
  orderId: number;
  orderNo: string;
  orderType: InspectionOrderType;
  licensePlateNo: string;
  vin: string;
  vehicleName: string;
  vehicleBrandName: string;
  vehicleBrandLogo: string;
  vehicleMileage: number;
  vehicleImageUrl?: string;
  dashboardImgUrl: string | null;
  serviceAgentId: number;
  serviceAgentName: string;
  serviceAgentMobile: string | null | undefined;
  orderedAt: Date;
  status: ReportStatus;
  preInspection: PreInspectionReport | null;
  inspection: InspectionReport | null;
  diagnostic: DiagnosticReport | null;
  quotation: QuotationReport | null;
  construction: ConstructionReport | null;
  deliveryCheck: DeliveryCheckReport | null;
  obdInspection: ObdInspectionReport | null;
  createdAt: Date;
  updatedAt: Date | null;
  changes: VehicleReportChange[];
  shareToken?: string;
  orgBrandName?: string;
  orgShortName?: string;
  orgLogoImgUrl?: string;
  orgIconUrl?: string;
  storeContactPhone?: string;
  storeContactMobile?: string;
  storeAddress?: string;
  score: number | null;
  appId?: string;
  openId?: string;
  serviceRecordNo?: string;
}
