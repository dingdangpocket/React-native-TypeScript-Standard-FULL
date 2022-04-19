/**
 * @file: isNull.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export function isNull<T>(
  value: T | null | undefined,
): value is null | undefined {
  return value == null;
}

export function isNotNull<T>(value: T | null | undefined): value is T {
  return value != null;
}
