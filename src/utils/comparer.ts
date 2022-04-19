/**
 * @file comparer.ts
 * @author Eric Xu <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export type CompareFn<T> = (x: T, y: T) => number;
type PropFn<T, U> = (x: T) => U;

export const comparer = <T extends number | string>(a: T, b: T) =>
  a < b ? -1 : a > b ? 1 : 0;

export const comparerDesc = <T extends number | string>(a: T, b: T) =>
  a < b ? 1 : a > b ? -1 : 0;

export function compareByProp<
  T extends { [name: string]: any },
  U extends string | number,
>(
  prop: string | PropFn<T, U>,
  desc = false,
  compareFn?: CompareFn<U>,
): CompareFn<T> {
  const compare = compareFn ?? comparer;
  return (a: T, b: T) => {
    if (typeof prop === 'function') {
      const [x, y] = [prop(a), prop(b)];
      return desc ? compare(y, x) : compare(x, y);
    } else {
      const [x, y] = [a[prop], b[prop]];
      return desc ? compare(y, x) : compare(x, y);
    }
  };
}
