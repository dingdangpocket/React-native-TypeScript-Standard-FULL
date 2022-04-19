/**
 * @file: OrgUser.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { Gender } from '../enum';
import { Organization } from './Organization';
import { Store } from './Store';

export interface OrgUser {
  id: number;
  uid?: string | null;
  orgId: number;
  storeId?: number | null;
  userName: string;
  email?: string | null;
  password: string;
  isDefaultPassword: boolean;
  isOrgRootUser: boolean;
  nick?: string | null;
  mobile?: string | null;
  isMobileVerified: boolean;
  avatarUrl?: string | null;
  role: string;
  gender?: Gender | null;
  country?: string | null;
  province?: string | null;
  city?: string | null;
  language?: string | null;
  enabled: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  lastLoginAt?: string | Date | null;
  deviceUuid?: string | null;
  deviceType?: string | null;
  os?: string | null;
  osVersion?: string | null;
  appVersion?: string | null;
  isWxBound: boolean;
  wxBoundAt?: string | Date | null;
  organization?: Organization;

  // flattened fields from associated Organization
  organizationName?: string;
  organizationCid?: string;
  store?: Store | null;

  // flattened fields from associated Store
  storeName?: string;

  // extra properties defined in codegen.yaml
  memberId?: number | null;
  name?: string | null;
  jobNo?: string | null;
  jobTitle?: string | null;
  managerId?: number | null;
  managerName?: string | null;
  remark?: string | null;
  requireChangePassword?: boolean | null;
}
