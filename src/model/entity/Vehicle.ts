/**
 * @file: Vehicle.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export interface Vehicle {
  id: number;
  licensePlateNo: string;
  vin: string;
  vehicleName: string;
  vehicleBrand: string;
  vehicleManufacturer?: string | null;
  vehicleModel: string;
  vehicleModelYear?: number | null;
  vehicleDisplacement?: string | null;
  vehicleTrimLevel?: string | null;
  vehicleFuelType?: string | null;
  lastServiceMileage?: number | null;
  lastServiceTime?: string | Date | null;
  nextServiceTime?: string | Date | null;
  nextServiceMileage?: number | null;
  createdAt: string | Date;
  updatedAt?: string | Date | null;

  // extra properties defined in codegen.yaml

  // vehicle brand logo
  vehicleBrandLogo?: string | null;

  // vehicle image
  vehicleImageUrl?: string | null;
}
