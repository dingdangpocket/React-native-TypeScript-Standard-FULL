/**
 * @file: UserWeixinBindingType.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum UserWeixinBindingType {
  Mp = 'mp',
  Open = 'open',
  App = 'app',
}

export const UserWeixinBindingTypeValueSet = new Set([
  UserWeixinBindingType.Mp,
  UserWeixinBindingType.Open,
  UserWeixinBindingType.App,
]);
