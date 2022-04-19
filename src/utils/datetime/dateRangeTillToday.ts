/**
 * @file: dateRangeTillToday.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { DateRange } from '@euler/model/common';
import dayjs from 'dayjs';

export function dateRangeTillToday(offset: number): DateRange {
  return {
    startDate: dayjs().add(-offset, 'd').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  };
}
