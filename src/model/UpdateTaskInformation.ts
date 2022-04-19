/**
 * @file: UpdateTaskInformation.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { VehicleInfo } from './entity';

export interface UpdateTaskInformation {
  licensePlateNo?: string;
  licensePlateNoImageUrl?: string;
  dashboardImgUrl?: string;
  preInspectionSignatureImgUrl?: string;
  deliveryCheckSignatureImgUrl?: string;
  vin?: string;
  vinImageUrl?: string;
  vehicleName?: string;
  vehicleBrandName?: string;
  vehicleManufacturer?: string;
  vehicleModel?: string;
  vehicleModelYear?: number;
  vehicleDisplacement?: string;
  vehicleFuelType?: string;
  mileage?: number;
  vehicleInfo?: VehicleInfo;
  remark?: string;
}
