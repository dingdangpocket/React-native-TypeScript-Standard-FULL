/**
 * @file: sensitizeParams.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
export function sensitizeParams(params?: any, level = 1): any {
  if (typeof params === 'function') {
    return undefined;
  }
  if (typeof params === 'number' && (isNaN(params) || !isFinite(params))) {
    return undefined;
  }
  if (
    params == null ||
    typeof params === 'string' ||
    typeof params === 'number' ||
    typeof params === 'boolean'
  ) {
    return params;
  }
  if (level === 0) {
    return undefined;
  }
  if (Array.isArray(params)) {
    return params.map(p => sensitizeParams(p, level - 1));
  }
  if (typeof params === 'object') {
    const result = {} as any;
    for (const key of Object.keys(params)) {
      const sensitizedParams = sensitizeParams(params[key], level - 1);
      if (typeof sensitizedParams === 'object') {
        continue;
      }
      result[key] = sensitizedParams;
    }
    return result;
  }
  return undefined;
}
