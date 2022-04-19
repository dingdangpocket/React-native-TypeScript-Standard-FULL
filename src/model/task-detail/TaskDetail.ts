import { Construction } from './Construction';
import { DeliveryCheck } from './DeliveryCheck';
import { Inspection } from './Inspection';
import { ObdInspection } from './ObdInspection';
import { PreInspection } from './PreInspection';
import { TaskBasicInfo } from './TaskBasicInfo';

export type TaskDetail = {
  basicInfo: TaskBasicInfo;
  preInspection: PreInspection;
  inspection: Inspection;
  obdInspection: ObdInspection;
  construction: Construction;
  deliveryCheck: DeliveryCheck;
  version: number;
};

export type CachedTaskDetail = TaskDetail & {
  // format version
  __VERSION: string;
  __TIMESTAMP: number;
};

export type TaskDetailProjection = {
  [key in keyof Omit<TaskDetail, 'version'>]?: boolean;
};
