import { VehicleInfo } from '@euler/model/entity';
import { InspectionOrderType } from '@euler/model/enum';

/**
 * @file: PlaceOrderRequest.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
export interface ServiceOrderServiceSubjectInfo {
  id: number;
  name: string;
  tag?: number | null;
}

export interface ServiceOrderInspectionSubjectInfo {
  id?: number | null;
  name: string;
}

export interface ServiceOrderInfo {
  orderType?: InspectionOrderType | null;
  licensePlateNo: string;
  licensePlateNoImgUrl?: string | null;
  licensePlateNoTimestamp?: string | null;
  vin: string;
  vinImgUrl?: string | null;
  vinTimestamp?: string | null;
  vehicleName: string;
  vehicleBrandName: string;
  vehicleModel: string;
  vehicleModelYear?: number | null;
  vehicleManufacturer?: string | null;
  vehicleDisplacement?: string | null;
  vehicleFuelType?: string | null;
  vehicleInfo?: VehicleInfo | null;
  mileageInKm: number;
  serviceSubjects?: ServiceOrderServiceSubjectInfo[];
  inspectionSubjects?: ServiceOrderInspectionSubjectInfo[] | null;
  serviceAgentId: number;
  serviceAgentName: string;
  startTask?: boolean | null;
  remark?: string | null;
}
