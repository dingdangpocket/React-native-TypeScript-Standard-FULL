/**
 * @file: formatPercent.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export function formatPercent(value: number, decimalPlaces = 1) {
  return (value * 100).toFixed(decimalPlaces).replace(/\.0+$/, '') + '%';
}
