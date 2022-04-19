import { ObdTroubleCode } from './ObdTroubleCode';

export type ObdInspection = {
  isInspected: boolean;
  inspectedBy?: string;
  inspectedAt?: string | Date;
  troubleCodes: ObdTroubleCode[];
  version: number;
};
