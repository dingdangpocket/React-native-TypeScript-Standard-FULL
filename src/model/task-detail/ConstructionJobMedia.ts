import { InspectionTaskJobMediaCategory } from '../enum';
import { TaskMedia, TaskMediaCommitPayload } from './TaskMedia';

export type ConstructionJobMedia = TaskMedia & {
  detailId?: number;
  procedure?: string;
  procedureOrder?: number;
  category: InspectionTaskJobMediaCategory;
  tag: number;
  seqNo: number;
};

export type ConstructionJobMediaCommitPayload = TaskMediaCommitPayload & {
  description?: string;
  detailId?: number;
  tag: number;
} & (
    | {
        category: InspectionTaskJobMediaCategory.Comparison;
        seqNo: number;
      }
    | {
        category:
          | InspectionTaskJobMediaCategory.Procedure
          | InspectionTaskJobMediaCategory.BeforeConstruction
          | InspectionTaskJobMediaCategory.AfterConstruction
          | InspectionTaskJobMediaCategory.ProductConfirm;
        procedure?: string;
        procedureOrder?: number;
        tag?: number;
      }
  );
