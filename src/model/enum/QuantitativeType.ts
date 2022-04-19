/**
 * @file: QuantitativeType.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum QuantitativeType {
  Quantitative = 'quantitative',
  NonQuantitative = 'non_quantitative',
}

export const QuantitativeTypeValueSet = new Set([
  QuantitativeType.Quantitative,
  QuantitativeType.NonQuantitative,
]);
