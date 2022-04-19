import {
  AbnormalLevel,
  SeverityLevel,
  SiteInspectionType,
  VehicleIssueStatus,
} from '../enum';
import {
  TaskMedia,
  TaskMediaCommitPayload,
  TaskMediaStaged,
} from './TaskMedia';

export type CustomIssue = {
  id: number;
  inspectionType: SiteInspectionType;
  siteId?: number;
  siteName: string;
  itemId?: number;
  itemName?: string;
  inspectionResult: string;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
  referenceState?: string;
  maintenanceAdvice?: string;
  label?: string;
  description?: string;
  technicianId: number;
  technicianName: string;
  status: VehicleIssueStatus;
  createdAt: string | Date;
  updatedAt?: string | Date;
  siteInfluenceFactor: number;
  itemInfluenceFactor: number;
  medias: TaskMedia[];
};

export type SiteCustomIssue = Omit<
  CustomIssue,
  'siteId' | 'itemName' | 'maintenanceAdvice'
> & {
  siteId: number;
  itemName: string;
  maintenanceAdvice: string;
};

export type CustomIssueCommitPayload = Omit<
  CustomIssue,
  | 'id'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
  | 'siteInfluenceFactor'
  | 'itemInfluenceFactor'
  | 'medias'
  | 'technicianId'
  | 'technicianName'
> & {
  id?: number;
  siteInfluenceFactor?: number;
  itemInfluenceFactor?: number;
  technicianId?: number;
  technicianName?: string;
  medias: TaskMediaCommitPayload[];
};

export type SiteCustomIssueCommitPayload = Omit<
  CustomIssueCommitPayload,
  'siteId' | 'siteName' | 'itemName'
> & { siteId: number; siteName: string; itemName: string };

// represents an inspection item in the staging area.
export type CustomIssueItemStaged = Omit<CustomIssueCommitPayload, 'medias'> & {
  medias: TaskMediaStaged[];
};
