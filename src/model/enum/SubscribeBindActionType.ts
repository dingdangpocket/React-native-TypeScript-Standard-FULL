/**
 * @file: SubscribeBindActionType.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum SubscribeBindActionType {
  Default = 0,
  PreCheck = 1,
  Diagnostic = 2,
  Construction = 3,
  Quotation = 4,
  DeliveryCheck = 5,
  Inspection = 6,
}

export const SubscribeBindActionTypeValueSet = new Set([
  SubscribeBindActionType.Default,
  SubscribeBindActionType.PreCheck,
  SubscribeBindActionType.Diagnostic,
  SubscribeBindActionType.Construction,
  SubscribeBindActionType.Quotation,
  SubscribeBindActionType.DeliveryCheck,
  SubscribeBindActionType.Inspection,
]);
