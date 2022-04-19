/**
 * @file: Store.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { Organization } from './Organization';
import { StoreMedia } from './StoreMedia';

export interface Store {
  id: number;
  orgId: number;
  name: string;
  provinceId?: number | null;
  cityId?: number | null;
  districtId?: number | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  contactPhone?: string | null;
  contactName?: string | null;
  contactMobile?: string | null;
  contactFax?: string | null;
  contactEmail?: string | null;
  managerId?: number | null;
  managerName?: string | null;
  introduction?: string | null;
  wifiSsid?: string | null;
  wifiPassword?: string | null;
  businessHours?: string | null;
  enabled: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  remark?: string | null;
  organization?: Organization;

  // flattened fields from associated Organization
  organizationName?: string;
  organizationShortName?: string;
  organizationBrandName?: string;
  organizationLogoImgUrl?: string | null;
  organizationIsChainBrand?: boolean;
  medias?: StoreMedia[];

  // extra properties defined in codegen.yaml

  // if the store is chain store
  isChainStore?: boolean;

  // the head image url of the store
  headImgUrl?: string | null;
}
