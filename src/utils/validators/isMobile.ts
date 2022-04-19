/**
 * @file: isMobile.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

const REGEX_MOBILE = /^1[3-9]\d{9}$/; // tslint:disable-line

export function isMobilePhone(s: string): boolean {
  return Boolean(s && REGEX_MOBILE.test(s));
}
