/**
 * @file: Organization.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { Store } from './Store';

export interface Organization {
  id: number;
  cid: string;
  name: string;
  brandName: string;
  shortName: string;
  logoImgUrl?: string | null;
  iconImgUrl?: string | null;
  wechatMpAccount?: string | null;
  wechatMpAppid?: string | null;
  isWeixinOpenAuthorized: boolean;
  weixinOpenAuthorizedAt?: string | Date | null;
  weixinOpenAuthorizationUpdatedAt?: string | Date | null;
  weixinOpenUnauthorizedAt?: string | Date | null;
  isChainBrand: boolean;
  provinceId?: number | null;
  cityId?: number | null;
  districtId?: number | null;
  contactName?: string | null;
  contactPhone?: string | null;
  contactMobile?: string | null;
  contactFax?: string | null;
  contactEmail?: string | null;
  address?: string | null;
  introduction?: string | null;
  description?: string | null;
  enabled: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  stores?: Store[];
}
