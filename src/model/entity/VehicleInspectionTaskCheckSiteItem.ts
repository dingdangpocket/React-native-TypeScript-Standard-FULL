/**
 * @file: VehicleInspectionTaskCheckSiteItem.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { AbnormalLevel, OptionValueType, SeverityLevel } from '../enum';
import { VehicleInspectionTaskCheckSiteItemData } from './VehicleInspectionTaskCheckSiteItemData';
import { VehicleInspectionTaskCheckSiteItemMedia } from './VehicleInspectionTaskCheckSiteItemMedia';

export interface VehicleInspectionTaskCheckSiteItem {
  id: number;
  taskId: number;
  taskSiteId: number;
  siteId: number;
  itemId: number;
  name: string;
  label?: string | null;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
  resultDataType: OptionValueType;
  resultDataNumberValue?: number | null;
  resultDataStringValue?: string | null;
  resultDataUnit?: string | null;
  resultDescription?: string | null;
  remark?: string | null;
  optionLabel?: string | null;
  optionLabelFormat?: string | null;
  optionLower?: number | null;
  optionUpper?: number | null;
  optionLowerInclusive: boolean;
  optionUpperInclusive: boolean;
  maintenanceAdvice?: string | null;
  constructionJobId?: number | null;
  isCustom: boolean;
  medias?: VehicleInspectionTaskCheckSiteItemMedia[];
  data?: VehicleInspectionTaskCheckSiteItemData[];
}
