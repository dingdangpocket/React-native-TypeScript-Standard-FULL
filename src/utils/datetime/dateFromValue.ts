/**
 * @file: dateFromValue.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import toDate from 'date-fns/toDate';

export const dateFromValue = (
  value: string | number | Date | null | undefined,
) => {
  if (value == null) return new Date();
  if (typeof value === 'string') return new Date(value);
  return toDate(value);
};
