/**
 * @file: factory.ts
 * @author: eric <eric.blueplus@gmail.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { InspectionTaskEventType } from '@euler/model/enum';
import { TimelineItemInfoBuilderImpl } from './builders/item-builder';
import { getTimelineItemBuilder } from './registry';
import { EventInfo, TimelineItemInfo, TimelineSectionType } from './types';

const EventType2SectionTypeMap = new Map<
  InspectionTaskEventType,
  TimelineSectionType
>([
  [InspectionTaskEventType.Creation, 'order'],
  [InspectionTaskEventType.PreInspection, 'pre-inspection'],
  [InspectionTaskEventType.Inspection, 'inspection'],
  [InspectionTaskEventType.Quotation, 'quotation'],
  [InspectionTaskEventType.Diagnostic, 'inspection'],
  [InspectionTaskEventType.Construction, 'construction'],
  [InspectionTaskEventType.DeliveryCheck, 'delivery-check'],
  [InspectionTaskEventType.Completion, 'delivery-check'],
  [InspectionTaskEventType.System, 'none'],
]);

export function timelineItemFactory(
  event: EventInfo,
  eventsMap: Map<string, EventInfo>,
): TimelineItemInfo | null {
  const builder = new TimelineItemInfoBuilderImpl(event);
  try {
    const fn = getTimelineItemBuilder(event);
    if (!fn) return null;
    builder.sectionType(EventType2SectionTypeMap.get(event.type)!);
    fn(builder, builder.data, eventsMap);
  } catch (e) {
    if (!builder.get().label) {
      builder.label((e as Error).message);
    }
  }
  return builder.get();
}
