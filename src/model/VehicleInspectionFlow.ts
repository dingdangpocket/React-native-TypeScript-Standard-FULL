/**
 * @file: VehicleInspectionFlow.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { InspectionCategory } from '@euler/model/enum';
import { InspectedItemLabel } from './InspectedItemLabel';
import { InspectionTemplateSnapshot } from './InspectionTemplateConf';
export type VehicleInspectionFlowStatus = 'pending' | 'inprogress' | 'finished';

export type InspectionFlowSummary = {
  normalCount: number;
  urgentCount: number;
  warningCount: number;
  defectiveCount: number;
};

export type VehicleInspectionFlow = {
  id: string;
  category: InspectionCategory;
  taskNo: string;
  orgId: number;
  storeId: number;
  name: string;
  description?: string;
  status: VehicleInspectionFlowStatus;
  template: InspectionTemplateSnapshot;
  createdAt: string | Date;
  updatedAt?: string | Date;
  startedAt?: string | Date;
  finishedAt?: string | Date;
  assignedTo: {
    id: number;
    name: string;
    avatar?: string;
  };
  finishOptions?: {
    labels?: InspectedItemLabel[];
    remark?: string;
  };
  resultSummary?: InspectionFlowSummary;
};
