/**
 * @file: fixTimestamp.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export function fixTimestamp(obj: any) {
  if (!obj) return obj;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      obj[i] = fixTimestamp(item);
    });
  } else if (typeof obj === 'object') {
    for (const p in obj) {
      if (p === 'timestamp' && typeof obj[p] === 'number') {
        obj[p] = obj[p] | 0;
      } else {
        obj[p] = fixTimestamp(obj[p]);
      }
    }
  }
  return obj;
}
