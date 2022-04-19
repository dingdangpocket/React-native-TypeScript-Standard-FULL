/**
 * @file: OrderSourceType.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum OrderSourceType {
  Default = 'default',
  OpenApi = 'openapi',
}

export const OrderSourceTypeValueSet = new Set([
  OrderSourceType.Default,
  OrderSourceType.OpenApi,
]);
