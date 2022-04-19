/**
 * @file: SiteInspection.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { DefectiveLevel } from '@euler/model';
import { OptionValueType } from '@euler/model/enum';
import { LocalTaskMediaSource } from '@euler/model/task-detail';

export type OptionInfo = {
  defectiveLevel: DefectiveLevel;
  isCustom?: boolean;
  title: string;
  maintenceAdvice?: string;
};

export type CheckItemInfo = {
  id?: number;
  customIssueId?: number;
  key: string;
  name: string;
  value?: number;
  itemId?: number;
  valueType?: OptionValueType;
  valueUnit?: string;
  protocolFieldId?: number;
  positionCode?: string;
  isPicPreferred?: boolean;
  options: OptionInfo[];
  selectedOptionIndex: number;
  medias?: MediaInfo[];
  isCustom?: boolean;
};

export type MediaInfo = {
  id?: number;
  key: string;
  cid?: string;
  type: 'image' | 'video';
  url: string;
  description?: string;
  coverUrl?: string | null;
  status?: LocalTaskMediaSource['state']['status'];
  progress?: number;
  error?: Error;
};
