/**
 * @file: OrgTeam.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { Organization } from './Organization';
import { Store } from './Store';

export interface OrgTeam {
  id: number;
  orgId: number;
  storeId: number;
  groupId: number;
  name: string;
  managerId?: number | null;
  managerName?: string | null;
  sortOrder: number;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  organization?: Organization;

  // flattened fields from associated Organization
  organizationName?: string;
  organizationCid?: string;
  store?: Store;

  // flattened fields from associated Store
  storeName?: string;
}
