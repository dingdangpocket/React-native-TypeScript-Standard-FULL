/**
 * @file: VehicleInfo.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
export interface VehicleInfo {
  id: number;
  vin: string;
  name: string;
  canonicalName: string;
  imgUrl?: string | null;
  brand?: string | null;
  modelName?: string | null;
  seriesName?: string | null;
  manufacturer?: string | null;
  carType?: string | null;
  modelYear?: number | null;
  emissionStandard?: string | null;
  fuelConsumption?: string | null;
  engineType?: string | null;
  engineInjectionType?: string | null;
  fuelType?: string | null;
  fuelLevel?: string | null;
  transmissionType?: string | null;
  gearType?: string | null;
  gearbox?: string | null;
  gearNum?: number | null;
  driveMode?: string | null;
  bodyType?: string | null;
  frontTireSize?: string | null;
  rearTireSize?: string | null;
  displacement?: string | null;
  displacementMl?: number | null;
  chassisType?: string | null;
  frontBrakeType?: string | null;
  rearBrakeType?: string | null;
  parkingBrakeType?: string | null;
  maxPower?: number | null;
  vehicleLevel?: string | null;
  seatNum?: number | null;
  bodyStructure?: string | null;
  maxHorsePower?: number | null;
  cylinderType?: string | null;
  cylinderNumber?: number | null;
  doorNum?: number | null;
  airBagType?: string | null;
  productionYear?: number | null;
  productionMonth?: number | null;
  stopYear?: number | null;
  assemblyFactory?: string | null;
  equipmentTotalWeight?: number | null;
  guidePrice?: string | null;
  relatedCarList?: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date | null;

  // extra properties defined in codegen.yaml

  // vehicle brand logo
  brandLogo?: string | null;
}
