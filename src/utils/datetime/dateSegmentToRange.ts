/**
 * @file: dateSegmentToRange.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { DateRange } from '@euler/model/common';
import { DateSegmentItem } from '@euler/model/viewmodel';
import dayjs from 'dayjs';
import { assertNever } from '../assertNever';
import { latestWorkday } from './latestWorkday';

export function dateSegmentToRange(
  segment: DateSegmentItem,
  offset = 0,
): DateRange {
  if (segment.type === 'offset') {
    const workday = latestWorkday();
    const isWorkdayToday = workday.getDate() == new Date().getDate();
    const dateRange: DateRange = {
      startDate: dayjs(latestWorkday())
        .add(segment.value + offset, segment.unit)
        .format('YYYY-MM-DD'),
      endDate: dayjs(latestWorkday())
        .add(offset + (isWorkdayToday ? 0 : 1), segment.unit)
        .format('YYYY-MM-DD'),
    };
    return dateRange;
  }
  assertNever(segment.type);
}
