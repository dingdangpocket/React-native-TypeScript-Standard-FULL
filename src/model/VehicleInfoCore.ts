/**
 * @file: VehicleInfoCore.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
export type VehicleInfoCore = {
  licensePlateNo: string;
  vin: string;
  vehicleName: string;
  vehicleImageUrl?: string;
  vehicleBrandName: string;
  vehicleBrandLogo?: string;
  vehicleMileage: number;
  vehicleManufacturer?: string;
  vehicleFuelType?: string;
  vehicleModel?: string;
  vehicleModelYear?: number;
  vehicleDisplacement?: string;
};
