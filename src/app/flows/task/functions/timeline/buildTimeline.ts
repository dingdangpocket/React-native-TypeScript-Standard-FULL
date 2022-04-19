/**
 * @file: buildTimeline.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { comparerDesc } from '@euler/utils';
import { arr2groupmap, array2map } from '@euler/utils/array';
import { timelineItemFactory } from './factory';
import {
  EventInfo,
  TimelineItem,
  TimelineSection,
  TimelineSectionType,
} from './types';

require('./builders');

const SectionLabelMap = new Map<TimelineSectionType, string>([
  ['order', '车辆建单'],
  ['pre-inspection', '车辆预检'],
  ['inspection', '全车检测'],
  ['quotation', '维修报价'],
  ['construction', '施工反馈'],
  ['delivery-check', '交车检查'],
]);

export function buildTimeline(
  taskNo: string,
  events: EventInfo[],
): TimelineSection[] {
  const eventMap = array2map(events, x => x.id);
  const itemList = events
    .map(x => timelineItemFactory(x, eventMap))
    .filter(x => x);
  const groups = arr2groupmap(itemList, x => x!.sectionType);
  const sections = [...groups.keys()].map(type => ({
    key: type,
    type,
    label: SectionLabelMap.get(type)!,
    items: groups.get(type)! as TimelineItem[],
  }));
  for (const section of sections) {
    section.items.sort((x, y) => comparerDesc(x.timestamp, y.timestamp));
  }
  sections.sort((x, y) =>
    comparerDesc(
      Math.min(...x.items.map(t => t.timestamp.getTime())),
      Math.min(...y.items.map(t => t.timestamp.getTime())),
    ),
  );
  return sections;
}
