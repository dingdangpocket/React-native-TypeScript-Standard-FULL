import { AbnormalLevel, OptionValueType, SeverityLevel } from '../enum';
import {
  TaskMedia,
  TaskMediaCommitPayload,
  TaskMediaStaged,
} from './TaskMedia';

export type SiteInspectionItem = {
  id: number;
  itemId: number;
  name: string;
  label?: string;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
  resultDataType: OptionValueType;
  resultDataNumberValue?: number;
  resultDataStringValue?: string;
  resultDataUnit?: string;
  resultDescription?: string;
  optionLabel?: string;
  optionLabelFormat?: string;
  optionLower?: number;
  optionUpper?: number;
  optionLowerInclusive: boolean;
  optionUpperInclusive: boolean;
  maintenanceAdvice?: string;
  constructionJobId?: number;
  isCustom: boolean;
  remark?: string;
  medias: TaskMedia[];
};

export type SiteInspectionItemNumericResult = {
  valueType:
    | OptionValueType.Number
    | OptionValueType.Celsius
    | OptionValueType.Fahrenheit
    | OptionValueType.Kilometer
    | OptionValueType.TenThousandsKm
    | OptionValueType.Year
    | OptionValueType.Millimeter
    | OptionValueType.Centimeter
    | OptionValueType.Percentage;
  value?: number;
  unit?: string;
  range?: {
    lower?: number;
    upper?: number;
    lowerInclusive: boolean;
    upperInclusive: boolean;
  };
};

export type SiteInspectionItemStringResult = {
  valueType: OptionValueType.String;
  value?: string;
};

export type SiteInspectionItemComplexResult = {
  valueType:
    | OptionValueType.Text
    | OptionValueType.Xml
    | OptionValueType.Json
    | OptionValueType.Csv
    | OptionValueType.Yaml
    | OptionValueType.Blob
    | OptionValueType.Custom;
  data: string;
};

export type SiteInspectionItemResult =
  | SiteInspectionItemNumericResult
  | SiteInspectionItemStringResult
  | SiteInspectionItemComplexResult;

export type SiteInspectionItemCommitPayload = {
  id?: number;
  itemId: number;
  name: string;
  label?: string;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;

  description?: string;
  optionLabel?: string;
  optionLabelFormat?: string;

  maintenanceAdvice?: string;
  constructionJobId?: number;
  isCustom: boolean;
  remark?: string;
  result: SiteInspectionItemResult;
  medias: TaskMediaCommitPayload[];
};

export type SiteInspectionItemType = 'item' | 'customIssue';

// represents an inspection item in the staging area.
export type SiteInspectionItemStaged = {
  _key: string;
  id?: number;
  name: string;
  label?: string;
  remark?: string;
  abnormalLevel: AbnormalLevel;
  severityLevel: SeverityLevel;
  medias: TaskMediaStaged[];
} & (
  | {
      type: 'item';
      itemId: number;
      optionLabel?: string;
      optionLabelFormat?: string;
      maintenanceAdvice?: string;
      isCustom: boolean;
      description?: string;
      constructionJobId?: number;
      result: SiteInspectionItemResult;
    }
  | {
      type: 'customIssue';
      referenceState?: string;
      inspectionResult: string;
      maintenanceAdvice: string;
      siteInfluenceFactor?: number;
      itemInfluenceFactor?: number;
      technicianId: number;
      technicianName: string;
    }
);
