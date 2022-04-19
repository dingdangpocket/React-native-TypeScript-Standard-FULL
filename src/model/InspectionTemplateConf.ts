/**
 * @file: InspectionTemplateConf.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import {
  InspectionTemplatePredefinedType,
  InspectionTemplateSceneType,
} from './enum';

export interface InspectionTemplateCategory {
  id: string;
  name: string;
  groups: InspectionTemplateGroup[];
  defaultOrders?: { [siteId: number]: number };
  workflowOrders?: { [siteId: number]: number };
}

export interface InspectionTemplateGroup {
  id: string;
  categoryId: string;
  name: string;
  siteIds: number[];
  siteRels?: { [siteId: number]: number[] };
  workflowOrders?: { [siteId: number]: number };
  disabledSiteIds?: number[];
  defaultHiddenSiteIds?: number[];
}

export interface InspectionTemplateConf {
  categories: InspectionTemplateCategory[];
}

export interface InspectionTemplateSnapshot {
  id: string;
  key: string;
  taskNo: string;
  originTemplateId: number;
  name: string;
  description?: string;
  icon?: string;
  sceneType: InspectionTemplateSceneType;
  isSystemDefault: boolean;
  isPredefined: boolean;
  predefinedType?: InspectionTemplatePredefinedType | null;
  totalSiteCount: number;
  totalItemCount: number;
  conf: InspectionTemplateConf;
}
