/**
 * @file: OrgUserWeixinBinding.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { UserWeixinBindingType } from '../enum';

export interface OrgUserWeixinBinding {
  id: number;
  bindingType: UserWeixinBindingType;
  userId: number;
  appId: string;
  openId: string;
  unionId?: string | null;
  createdAt: string | Date;
}
