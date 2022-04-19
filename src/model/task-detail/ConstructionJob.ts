import { InspectionTaskJobStatus } from '../enum';
import { ConstructionJobDetail } from './ConstructionJobDetail';
import {
  ConstructionJobMedia,
  ConstructionJobMediaCommitPayload,
} from './ConstructionJobMedia';

export type ConstructionJob = {
  id: number;
  name: string;
  label?: string;
  status: InspectionTaskJobStatus;
  isCustom: boolean;
  commitId?: string;
  remark?: string;
  technicianId?: number;
  technicianName?: string;
  details: ConstructionJobDetail[];
  medias: ConstructionJobMedia[];
  createdAt: string | Date;
  updatedAt?: string | Date;
  finishedAt?: string | Date;
};

export type ConstructionJobCommitPayload = Omit<
  ConstructionJob,
  | 'status'
  | 'details'
  | 'name'
  | 'label'
  | 'medias'
  | 'createdAt'
  | 'updatedAt'
  | 'finishedAt'
  | 'isCustom'
  | 'technicianId'
  | 'technicianName'
> & {
  technicianId: number;
  technicianName: string;
  nextServiceInfo?: {
    nextServiceMileage: number;
    nextServiceDate: string;
  };
  medias: ConstructionJobMediaCommitPayload[];
};
