/**
 * @file: useVehicleModelList.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { useServiceFactory } from '@euler/services/factory';
import { useAsyncResource } from '@euler/utils/hooks';
import { useCallback } from 'react';

export const useVehicleModelList = (brand: string) => {
  const { vehicleInfoService } = useServiceFactory();
  const fetch = useCallback(
    () => vehicleInfoService.getVehicleModelsByBrand(brand),
    [vehicleInfoService, brand],
  );
  return useAsyncResource(fetch, `vehicle-info-lib/brands/${brand}/models`);
};
