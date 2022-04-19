/**
 * @file: InspectionReportItem.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import {
  AbnormalLevel,
  OptionValueType,
  SeverityLevel,
  SiteInspectionType,
} from '../enum';
import { MediaInfo } from './MediaInfo';

export interface InspectionReportItemData {
  dataType: string;
  data: string;
}

export enum InspectionReportItemType {
  Normal = 1,
  UserDefined = 2,
  CustomIssue = 3,
}

export interface InspectionReportItem {
  type: InspectionReportItemType;
  label: string | null;
  inspectionType: SiteInspectionType;
  positionCode: string | null;
  siteId: number | null;
  siteCode: string | null;
  siteName: string | null;
  sitePositionCode: string | null;
  siteInfluenceFactor: number;
  siteItemId: number | null;
  siteItemName: string | null;
  siteItemInfluenceFactor: number;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
  referenceState: string | null;
  maintenanceAdvice: string | null;
  resultDataType: OptionValueType;
  resultDataNumberValue: number | null;
  resultDataStringValue: string | null;
  resultDataUnit: string | null;
  resultRemark: string | null;
  normalValueType: OptionValueType | null;
  normalValueUnit: string | null;
  normalResultLabel: string | null;
  normalResultLabelFormat: string | null;
  normalResultLower: number | null;
  normalResultUpper: number | null;
  normalResultLowerInclusive: boolean;
  normalResultUpperInclusive: boolean;
  abnormalResultLabel: string | null;
  abnormalResultLabelFormat: string | null;
  abnormalResultLower: number | null;
  abnormalResultUpper: number | null;
  abnormalResultLowerInclusive: boolean;
  abnormalResultUpperInclusive: boolean;
  abnormalDescription: string | null;
  data: InspectionReportItemData[];
  medias: MediaInfo[];
}

export interface InspectionReportItemWithKey extends InspectionReportItem {
  reportNo: string;
  key: string;
}
