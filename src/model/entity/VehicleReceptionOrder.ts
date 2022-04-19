/**
 * @file: VehicleReceptionOrder.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import {
  InspectionOrderPriority,
  InspectionOrderType,
  OrderSourceType,
  ReceptionOrderStatus,
} from '../enum';
import { Organization } from './Organization';
import { Store } from './Store';
import { VehicleReceptionOrderTechnician } from './VehicleReceptionOrderTechnician';

export interface VehicleReceptionOrder {
  id: number;
  orgId: number;
  storeId: number;
  orderNo: string;
  orderType: InspectionOrderType;
  vin: string;
  licensePlateNo: string;
  vehicleName: string;
  vehicleBrandName: string;
  vehicleManufacturer?: string | null;
  vehicleModel: string;
  vehicleModelYear?: number | null;
  vehicleDisplacement?: string | null;
  vehicleTrimLevel?: string | null;
  vehicleFuelType?: string | null;
  vehicleMileage: number;
  customerName?: string | null;
  customerMobile?: string | null;
  serviceAgentId: number;
  serviceAgentName: string;
  status: ReceptionOrderStatus;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  startedAt?: string | Date | null;
  finishedAt?: string | Date | null;
  licensePlateNoImgUrl?: string | null;
  vinImgUrl?: string | null;
  dashboardImgUrl?: string | null;
  elapsedTime?: number | null;
  priority: InspectionOrderPriority;
  expectedDuration?: number | null;
  nextServiceMileage?: number | null;
  nextServiceDate?: string | Date | null;
  ratingScore?: number | null;
  ratedAt?: string | Date | null;
  remark?: string | null;
  preInspectionSignatureImgUrl?: string | null;
  preInspectionSignedAt?: string | Date | null;
  deliveryCheckSignatureImgUrl?: string | null;
  deliveryCheckSignedAt?: string | Date | null;
  source: OrderSourceType;
  sourceOrderno?: string | null;
  sourceAppid?: string | null;
  technicians?: VehicleReceptionOrderTechnician[];
  org?: Organization;

  // flattened fields from associated Organization
  organizationName?: string;
  store?: Store;

  // flattened fields from associated Store
  storeName?: string;

  // extra properties defined in codegen.yaml

  // vehicle brand logo
  vehicleBrandLogo?: string | null;

  // vehicle image
  vehicleImageUrl?: string | null;
}
