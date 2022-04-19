/**
 * @file: vinHelper.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
const kNonVinChar = /[^ABCDEFGHJKLMNPRSTUVWXYZ1234567890]/g;

export function isValidVin(s: string) {
  return /^[ABCDEFGHJKLMNPRSTUVWXYZ1234567890]{17}$/.test(s);
}

export function validateVin(s: string) {
  if (isValidVin(s)) {
    return true;
  }
  return { error: '您输入的VIN码格式不正确' };
}

export function vinTransformed(s: string) {
  return s.toUpperCase().replace(kNonVinChar, '').slice(0, 17);
}
