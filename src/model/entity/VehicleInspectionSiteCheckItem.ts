/**
 * @file: VehicleInspectionSiteCheckItem.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { OptionValueType } from '../enum';
import { VehicleInspectionSiteCheckItemMedia } from './VehicleInspectionSiteCheckItemMedia';
import { VehicleInspectionSiteCheckItemOption } from './VehicleInspectionSiteCheckItemOption';

export interface VehicleInspectionSiteCheckItem {
  id: number;
  orgId?: number | null;
  storeId?: number | null;
  siteId: number;
  name: string;
  positionCode?: string | null;
  valueType?: OptionValueType | null;
  valueUnit?: string | null;
  protocolFieldId?: number | null;
  influenceFactor: number;
  toolId?: number | null;
  isPicPreferred: boolean;
  referenceState?: string | null;
  description?: string | null;
  sortOrder: number;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  medias?: VehicleInspectionSiteCheckItemMedia[];
  options?: VehicleInspectionSiteCheckItemOption[];
}
