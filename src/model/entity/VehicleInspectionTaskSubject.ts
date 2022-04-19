/**
 * @file: VehicleInspectionTaskSubject.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { InspectionTaskSubjectType } from '../enum';

export interface VehicleInspectionTaskSubject {
  id: number;
  orgId: number;
  storeId: number;
  taskId: number;
  type: InspectionTaskSubjectType;
  subjectId: number;
  name: string;
  tag?: number | null;
  remark?: string | null;
  createdAt: string | Date;
}
