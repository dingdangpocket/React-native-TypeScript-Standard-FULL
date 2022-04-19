/**
 * @file: dateRangeTillLastWorkday.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { DateRange } from '@euler/model/common';
import dayjs from 'dayjs';
import { latestWorkday } from './latestWorkday';

export function dateRangeTillLastWorkday(offset: number): DateRange {
  return {
    startDate: dayjs(latestWorkday()).add(-offset, 'd').format('YYYY-MM-DD'),
    endDate: dayjs(latestWorkday()).format('YYYY-MM-DD'),
  };
}
