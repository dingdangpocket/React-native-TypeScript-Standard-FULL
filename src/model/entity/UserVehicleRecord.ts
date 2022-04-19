/**
 * @file: UserVehicleRecord.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export interface UserVehicleRecord {
  id: number;
  userId: number;
  licensePlateNo: string;
  vin: string;
  mileage: number;
  recordTime: string | Date;
  storeId?: number | null;
  storeName?: string | null;
  cost?: number | null;
  details?: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
}
