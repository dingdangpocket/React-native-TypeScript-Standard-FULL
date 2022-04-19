/**
 * @file: VehicleInspectionTaskAssignment.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export interface VehicleInspectionTaskAssignment {
  id: number;
  taskId: number;
  technicianId: number;
  technicianName: string;
  parentId?: number | null;
  createdAt: string | Date;
}
