/**
 * @file: random.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export function random<T>(coll: T[]): T {
  const i = Math.floor(Math.random() * coll.length);
  return coll[i];
}
