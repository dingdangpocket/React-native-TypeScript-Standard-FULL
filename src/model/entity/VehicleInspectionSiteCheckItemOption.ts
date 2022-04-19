/**
 * @file: VehicleInspectionSiteCheckItemOption.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { AbnormalLevel, SeverityLevel } from '../enum';

export interface VehicleInspectionSiteCheckItemOption {
  id: number;
  orgId?: number | null;
  storeId?: number | null;
  itemId: number;
  label: string;
  labelFormat?: string | null;
  description?: string | null;
  lower?: number | null;
  upper?: number | null;
  lowerInclusive: boolean;
  upperInclusive: boolean;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
  isPicPreferred: boolean;
  maintenanceAdvice?: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
}
