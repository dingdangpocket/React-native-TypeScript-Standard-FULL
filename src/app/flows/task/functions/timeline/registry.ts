/**
 * @file: registry.ts
 * @author: eric <eric.blueplus@gmail.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import {
  InspectionTaskEventSubType,
  InspectionTaskEventType,
} from '@euler/model/enum';
import { EventInfo, TimelineItemBuilder } from './types';

type BuilderMap = Map<InspectionTaskEventSubType, TimelineItemBuilder>;
const registry: Map<InspectionTaskEventType, BuilderMap> = new Map();

export function getTimelineItemBuilder(
  event: EventInfo,
): TimelineItemBuilder | undefined {
  return registry.get(event.type)?.get(event.subType);
}

export function registerEventType(type: InspectionTaskEventType) {
  return function registerForEventSubType(subType: InspectionTaskEventSubType) {
    return function (builder: TimelineItemBuilder) {
      if (!registry.has(type)) {
        registry.set(type, new Map());
      }
      registry.get(type)!.set(subType, builder);
    };
  };
}
