/**
 * @file: VehicleInspectionTaskQuotation.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { AbnormalLevel, SeverityLevel } from '../enum';
import { VehicleInspectionTaskQuotationDetail } from './VehicleInspectionTaskQuotationDetail';
import { VehicleInspectionTaskQuotationIssue } from './VehicleInspectionTaskQuotationIssue';

export interface VehicleInspectionTaskQuotation {
  id: number;
  formId: number;
  quotationNo: string;
  orgId: number;
  storeId: number;
  taskId: number;
  orderId: number;
  name: string;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
  manHourCost?: number | null;
  description?: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  technicianId?: number | null;
  technicianName?: string | null;
  sortOrder: number;
  details?: VehicleInspectionTaskQuotationDetail[];
  issues?: VehicleInspectionTaskQuotationIssue[];
}
