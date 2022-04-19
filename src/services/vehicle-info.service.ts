/**
 * @file: vin-info.service.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { HttpClient } from '@euler/lib/request';
import {
  VehicleInfoCore,
  VehicleServiceManifest,
  VehicleServiceRecord,
} from '@euler/model';
import { VehicleInfo } from '@euler/model/entity';
import { ResourceAccessScope } from '@euler/model/enum';
import { VehicleBrandInfo, VehicleModelInfo } from '@euler/model/vehicle';
import { DecodedVinInfo } from '@euler/model/vehicle/VinInfo';
import { formatDate } from '@euler/utils/formatters';

export type VehicleServiceInfo = {
  vehicleInfo: VehicleInfoCore;
  serviceRecords: VehicleServiceRecord[];
  hasObservers: boolean;
};

export class VehicleInfoService {
  constructor(private readonly api: HttpClient) {}

  async getVehicleBrands(): Promise<VehicleBrandInfo[]> {
    return await this.api.get().url('/vehicle-info/brands').future();
  }

  async getVehicleModelsByBrand(brand: string): Promise<VehicleModelInfo[]> {
    return await this.api.get().url('/vehicle-info/models', { brand }).future();
  }

  async getVinInfo(
    vin: string,
    options?: {
      refresh?: boolean;
    },
  ): Promise<{
    vinInfo: VehicleInfo;
    decodedVinInfo?: DecodedVinInfo | null;
  }> {
    return await this.api
      .get()
      .url('/vehicle-info/vin-info', { vin, ...options })
      .future();
  }

  async listVehicleServiceInfo(options: {
    scope: ResourceAccessScope;
    plateno?: string;
    vin?: string;
    task_no?: string;
    start_date?: string | Date;
    end_date?: string | Date;
    offset?: number;
    limit?: number;
  }): Promise<VehicleServiceInfo | null> {
    return await this.api
      .get()
      .url('/vehicle-info/service-records', {
        ...options,
        start_date: options.start_date
          ? formatDate(options.start_date)
          : undefined,
        end_date: options.end_date ? formatDate(options.end_date) : undefined,
      })
      .future();
  }

  async queryVehicleServiceManifest(
    vin: string,
    options?: {
      task_no?: string;
      start_date?: string | Date;
      end_date?: string | Date;
    },
  ): Promise<VehicleServiceManifest> {
    return await this.api
      .get()
      .url('/vehicle-info/service-manifest', {
        vin,
        ...options,
        start_date: options?.start_date
          ? formatDate(options?.start_date)
          : undefined,
        end_date: options?.end_date ? formatDate(options?.end_date) : undefined,
      })
      .future();
  }
}
