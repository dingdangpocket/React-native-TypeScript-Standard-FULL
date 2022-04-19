/**
 * @file: VehicleInspectionTaskQuotationForm.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { VehicleInspectionTaskQuotation } from './VehicleInspectionTaskQuotation';

export interface VehicleInspectionTaskQuotationForm {
  id: number;
  formNo: string;
  orgId: number;
  storeId: number;
  taskId: number;
  status: number;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  initiatedAt?: string | Date | null;
  submittedAt?: string | Date | null;
  confirmedAt?: string | Date | null;
  finishedAt?: string | Date | null;
  initiatedBy?: number | null;
  initiatedByName?: string | null;
  submittedBy?: number | null;
  submittedByName?: string | null;
  confirmedBy?: number | null;
  confirmedByName?: string | null;
  totalCost: number;
  details?: VehicleInspectionTaskQuotation[];
}
