/**
 * @file: UserInfo.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { Gender } from '@euler/model/enum';

export interface UserInfo {
  userId: number;
  uid: string;
  memberId: number;
  orgId: number;
  storeId: number;
  userName: string;
  role: string;
  email?: string | null;
  mobile?: string | null;
  isMobileVerified: boolean;
  nick?: string | null;
  name: string;
  jobNo?: string | null;
  jobTitle: string;
  managerId?: number | null;
  managerName?: string | null;
  remark?: string | null;
  avatar?: string | null;
  gender?: Gender | null;
  country?: string | null;
  province?: string | null;
  enabled: boolean;
  createdAt: string;
  updatedAt?: string | null;
  lastLoginat?: string | null;
  groupId?: number | null;
  groupName?: string | null;
  teamId?: number | null;
  teamName?: string | null;
  isDefaultPassword: boolean;
}
