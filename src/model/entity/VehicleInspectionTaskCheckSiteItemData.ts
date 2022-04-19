/**
 * @file: VehicleInspectionTaskCheckSiteItemData.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { CheckResultDataType } from '../enum';

export interface VehicleInspectionTaskCheckSiteItemData {
  id: number;
  taskId: number;
  taskSiteId: number;
  taskItemId: number;
  dataType: CheckResultDataType;
  data?: string | null;
}
