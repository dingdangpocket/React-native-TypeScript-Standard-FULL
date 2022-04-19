import { TaskMedia, TaskMediaCommitPayload } from './TaskMedia';

export type DeliveryCheckItem = {
  id: number;
  title: string;
  constructionJobId?: number;
  resultCode: string;
  resultText?: string;
  remark?: string;
  technicianId: number;
  technicianName: string;
  medias: TaskMedia[];
};

export type DeliveryCheckItemCommitPayload = Omit<
  DeliveryCheckItem,
  'id' | 'technicianId' | 'technicianName' | 'medias'
> & {
  id?: number;
  medias?: TaskMediaCommitPayload[];
};
