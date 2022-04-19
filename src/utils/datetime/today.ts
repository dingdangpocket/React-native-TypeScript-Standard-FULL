/**
 * @file: today.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import dayjs from 'dayjs';

export function today() {
  return dayjs().startOf('d').toDate();
}
