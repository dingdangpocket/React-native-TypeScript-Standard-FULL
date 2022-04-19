/**
 * @file: OrgMember.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { Gender } from '../enum';
import { Organization } from './Organization';
import { OrgGroup } from './OrgGroup';
import { OrgTeam } from './OrgTeam';
import { Store } from './Store';

export interface OrgMember {
  id: number;
  orgId: number;
  storeId: number;
  groupId?: number | null;
  teamId?: number | null;
  userId: number;
  userName: string;
  name: string;
  mobile?: string | null;
  jobNo?: string | null;
  jobTitle?: string | null;
  remark?: string | null;
  managerId?: number | null;
  managerName?: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  organization?: Organization;

  // flattened fields from associated Organization
  organizationName?: string;
  organizationCid?: string;
  store?: Store;

  // flattened fields from associated Store
  storeName?: string;
  group?: OrgGroup | null;

  // flattened fields from associated OrgGroup
  groupCode?: string;
  groupName?: string;
  team?: OrgTeam | null;

  // flattened fields from associated OrgTeam
  teamName?: string;

  // extra properties defined in codegen.yaml
  password?: string | null;
  nick?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  role?: string | null;
  gender?: Gender | null;
  requireChangePassword?: boolean | null;
}
