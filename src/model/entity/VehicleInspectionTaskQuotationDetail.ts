/**
 * @file: VehicleInspectionTaskQuotationDetail.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export interface VehicleInspectionTaskQuotationDetail {
  id: number;
  taskId: number;
  quotationId: number;
  name: string;
  qty: number;
  unit: string;
  sortOrder: number;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
}
