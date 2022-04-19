import { CommonTaskStatus } from '../enum';
import {
  ConstructionJob,
  ConstructionJobCommitPayload,
} from './ConstructionJob';

export type Construction = {
  status: CommonTaskStatus;
  jobs: ConstructionJob[];
  isScheduled: boolean;
  scheduledAt?: string | Date;
  finishedBy?: string;
  finishedAt?: string | Date;
  version: number;
};

export type ConstructionCommitPayload = {
  jobs: ConstructionJobCommitPayload[];
};
