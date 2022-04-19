import { InspectionTaskTroubleCodeState } from '../enum';

export type ObdTroubleCode = {
  id: number;
  sourceModule: string;
  sourceModuleName: string;
  code?: string;
  description?: string;
  status?: InspectionTaskTroubleCodeState;
  statusText?: string;
  sortOrder: number;
};

export type ObdTroubleCodeCommitPayload = Omit<ObdTroubleCode, 'id'> & {
  id?: number;
};
