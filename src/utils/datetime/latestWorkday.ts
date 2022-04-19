/**
 * @file: latestWorkday.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import dayjs from 'dayjs';

export function latestWorkday(startWorkingHour = 9) {
  const date = dayjs();
  if (date.hour() < startWorkingHour)
    return date.add(-1, 'd').startOf('d').toDate();
  return date.startOf('d').toDate();
}
