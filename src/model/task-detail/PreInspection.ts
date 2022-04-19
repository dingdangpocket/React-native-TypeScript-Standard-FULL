import { Inspection } from './Inspection';

export type PreInspection = Inspection & {
  signatureImgUrl?: string;
  dashboardImgUrl?: string;
};
