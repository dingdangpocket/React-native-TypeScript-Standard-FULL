/**
 * @file: maybe.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export function maybe<T>(t: T | null | undefined): T | undefined {
  return t ?? undefined;
}
