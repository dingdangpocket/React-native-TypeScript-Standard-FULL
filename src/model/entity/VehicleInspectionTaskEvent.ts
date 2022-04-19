/**
 * @file: VehicleInspectionTaskEvent.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import {
  InspectionTaskEventDataType,
  InspectionTaskEventSubType,
  InspectionTaskEventType,
} from '../enum';

export interface VehicleInspectionTaskEvent {
  id: number;
  orgId: number;
  storeId: number;
  taskId?: number | null;
  type: InspectionTaskEventType;
  subType: InspectionTaskEventSubType;
  subject?: string | null;
  timestamp: string | Date;
  key?: string | null;
  keyData?: string | null;
  data?: string | null;
  dataType: InspectionTaskEventDataType;
  dataVersion?: number | null;
  authorId?: number | null;
  author?: string | null;
  createdAt: string | Date;
}
