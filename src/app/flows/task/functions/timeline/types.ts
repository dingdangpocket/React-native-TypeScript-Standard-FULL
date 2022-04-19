/**
 * @file: timeline.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { AttributedText } from '@euler/model/AttributedText';
import {
  InspectionTaskEventDataType,
  InspectionTaskEventSubType,
  InspectionTaskEventType,
} from '@euler/model/enum';

export interface TimelineItemMedia {
  key?: string;
  id: string;
  type: string;
  url: string;
  coverUrl: string | null | undefined;
}

export type TextLine = string | AttributedText | (string | AttributedText)[];
export interface TimelineItem {
  key: string;
  author: string;
  label: TextLine;
  taglines: TextLine[];
  timestamp: Date;
  medias?: TimelineItemMedia[] | null;
  sourceEvent: any;
}

export interface TimelineSection {
  key: string;
  type: TimelineSectionType;
  label: string;
  url?: string | null;
  items: TimelineItem[];
}

export interface EventInfo {
  id: string;
  type: InspectionTaskEventType;
  subType: InspectionTaskEventSubType;
  timestamp: Date;
  data: string | null | undefined;
  dataType: InspectionTaskEventDataType;
  dataVersion: number;
  author: string | null | undefined;
}

export type TimelineSectionType =
  | 'none'
  | 'order'
  | 'pre-inspection'
  | 'inspection'
  | 'construction'
  | 'quotation'
  | 'delivery-check';

export interface TimelineItemInfo extends TimelineItem {
  sectionType: TimelineSectionType;
}

export interface TimelineItemInfoBuilder {
  readonly data: any;
  key(value: string): this;
  author(value: string): this;
  label(value: TextLine): this;
  tagline(value: TextLine): this;
  medias(values: TimelineItemMedia[] | string): this;
}

export type TimelineItemBuilder = (
  builder: TimelineItemInfoBuilder,
  data: any,
  eventMap: Map<string, EventInfo>,
) => void;
