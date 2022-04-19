/**
 * @file: sorted.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { CompareFn } from '@euler/utils/comparer';

export const sorted = <T>(arr: T[], comparer: CompareFn<T>): T[] => {
  const result = arr.slice();
  result.sort(comparer);
  return result;
};
