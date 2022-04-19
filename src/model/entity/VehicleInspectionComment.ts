/**
 * @file: VehicleInspectionComment.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { InspectionOrderType, ReviewStatus } from '../enum';
import { Organization } from './Organization';
import { Store } from './Store';

export interface VehicleInspectionComment {
  id: number;
  orgId: number;
  storeId: number;
  orderId: number;
  orderNo: string;
  orderType: InspectionOrderType;
  vehicleName: string;
  licensePlateNo?: string | null;
  vin?: string | null;
  score: number;
  serviceAttitudeScore: number;
  serviceEfficiencyScore: number;
  professionalDegreeScore: number;
  satisfactionDegreeScore: number;
  comment?: string | null;
  hasCommentText: boolean;
  reviewedAt?: string | Date | null;
  reviewedBy?: number | null;
  reviewedName?: string | null;
  reviewRemark?: string | null;
  isTop: boolean;
  toppedAt?: string | Date | null;
  topOrder: number;
  reply?: string | null;
  repliedBy?: number | null;
  repliedName?: string | null;
  userId: number;
  userNick?: string | null;
  userAvatarUrl?: string | null;
  createdAt: string | Date;
  orderedAt: string | Date;
  finishedAt: string | Date;
  reviewStatus: ReviewStatus;
  org?: Organization;

  // flattened fields from associated Organization
  organizationName?: string;
  store?: Store;

  // flattened fields from associated Store
  storeName?: string;
}
