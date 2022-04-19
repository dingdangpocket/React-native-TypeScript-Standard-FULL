/**
 * @file: setUtils.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export const setWithItemRemoved = <T>(set: Set<T>, item: T) => {
  const res = new Set(set);
  res.delete(item);
  return res;
};

export const setWithItemAdded = <T>(set: Set<T>, item: T) => {
  return new Set([...set, item]);
};
