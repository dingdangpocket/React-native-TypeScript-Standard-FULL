/**
 * @file: InspectionTemplateInfo.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import {
  AbnormalLevel,
  InspectionTemplatePredefinedType,
  InspectionTemplateSceneType,
  OptionValueType,
  SeverityLevel,
} from './enum';
import { InspectionTemplateConf } from './InspectionTemplateConf';

export interface InspectionTemplate {
  id: number;
  orgId?: number | null;
  storeId?: number | null;
  agentId?: number | null;
  sceneType: InspectionTemplateSceneType;
  name: string;
  isSystemDefault: boolean;
  isPredefined: boolean;
  type: InspectionTemplatePredefinedType;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  description?: string | null;
  conf: InspectionTemplateConf;
  icon?: string | null;
  customization?: string | null;
}

export interface InspectionTemplateInfo {
  id: number;
  sceneType: InspectionTemplateSceneType;
  name: string;
  isSystem: boolean;
  isSystemDefault: boolean;
  description?: string | null;
  sites: InspectionTemplateSiteInfo[];
}

export interface InspectionTemplateSiteInfo {
  id: number;
  templateSiteId: number;
  code: string;
  name: string;
  description?: string | null;
  purpose?: string | null;
  categoryId?: number | null;
  imgUrl?: string | null;
  iconUrl?: string | null;
  sortOrder: number;
  items: InspectionTemplateSiteItemInfo[];
}

export interface InspectionTemplateSiteItemInfo {
  id: number;
  name: string;
  templateSiteItemId: number;
  valueType?: OptionValueType | null;
  valueUnit?: string | null;
  protocolFieldId?: number | null;
  toolId?: number | null;
  options: InspectionTemplateSiteItemOptionInfo[];
}

export interface InspectionTemplateSiteItemOptionInfo {
  id: number;
  label: string;
  labelFormat?: string | null;
  description?: string | null;
  lower?: number | null;
  upper?: number | null;
  lowerInclusive: boolean;
  upperInclusive: boolean;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
}

export type TemplateExtra = 'site' | 'item' | 'option';
