/**
 * @file: VehicleServiceSubject.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { VehicleServiceSubjectTag } from '../enum';
import { Organization } from './Organization';
import { Store } from './Store';

export interface VehicleServiceSubject {
  id: number;
  orgId?: number | null;
  storeId?: number | null;
  name: string;
  pyInitial?: string | null;
  tag?: VehicleServiceSubjectTag | null;
  isSystemDefined: boolean;
  isDefault: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  org?: Organization | null;

  // flattened fields from associated Organization
  organizationName?: string;
  store?: Store | null;

  // flattened fields from associated Store
  storeName?: string;
}
