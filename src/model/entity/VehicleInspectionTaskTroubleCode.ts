/**
 * @file: VehicleInspectionTaskTroubleCode.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { InspectionTaskTroubleCodeState } from '../enum';

export interface VehicleInspectionTaskTroubleCode {
  id: number;
  orgId: number;
  storeId: number;
  taskId: number;
  vin: string;
  mileage: number;
  date: string | Date;
  sourceModule: string;
  sourceModuleName: string;
  code?: string | null;
  description?: string | null;
  status?: InspectionTaskTroubleCodeState | null;
  statusText?: string | null;
  sortOrder: number;
  createdAt: string | Date;
}
