/**
 * @file uniq.ts
 * @author Eric Xu <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

type KeyFn<T> = (x: T) => any;

export function uniq<T>(
  arr: T[],
  keyFunc: KeyFn<T> = x => (typeof x === 'object' ? JSON.stringify(x) : x),
): T[] {
  const result: T[] = [];
  const set = new Set<any>();
  for (const item of arr) {
    const key = keyFunc(item);
    if (!set.has(key)) {
      set.add(key);
      result.push(item);
    }
  }
  return result;
}
