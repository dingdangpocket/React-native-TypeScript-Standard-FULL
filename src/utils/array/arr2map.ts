/**
 * @file arr2map.ts
 * @author Eric Xu <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

type KeyFunc<T, TKey = any> = (obj: T, i: number) => TKey;
type ValueFunc<T, TValue> = (obj: T, i: number) => TValue;

export function arr2map<T, TValue = T>(
  arr: T[],
  keyFunc: KeyFunc<T>,
  valueFunc?: ValueFunc<T, TValue>,
): { [key: string]: TValue } {
  return arr.reduce((map: { [key: string]: TValue }, x, i) => {
    if (valueFunc) {
      map[keyFunc(x, i)] = valueFunc(x, i);
    } else {
      map[keyFunc(x, i)] = x as any as TValue;
    }
    return map;
  }, {});
}

/**
 * Convert an array to native JavaScript `Map`.
 * @returns {Map<TKey, TValue>}
 */
export function array2map<T, TKey, TValue = T>(
  arr: T[],
  keyFunc: KeyFunc<T, TKey>,
  valueFunc?: ValueFunc<T, TValue>,
): Map<TKey, TValue> {
  return arr.reduce((map: Map<TKey, TValue>, x, i) => {
    if (valueFunc) {
      map.set(keyFunc(x, i), valueFunc(x, i));
    } else {
      map.set(keyFunc(x, i), x as any as TValue);
    }
    return map;
  }, new Map<TKey, TValue>());
}
