/**
 * @file: useDeliveryCheckTemplates.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { ResourceAccessScope } from '@euler/model/enum';
import { useServiceFactory } from '@euler/services/factory';
import { useAsyncResource } from '@euler/utils/hooks';
import { useCallback } from 'react';

export const useDeliveryCheckTemplates = (
  props: {
    scope?: ResourceAccessScope;
  } = {},
) => {
  const { scope } = props;
  const { inventoryService } = useServiceFactory();
  const fetch = useCallback(() => {
    return inventoryService.getDeliveryCheckTemplates(scope);
  }, [inventoryService, scope]);
  const key = ['delivery-check-templates', scope ?? 'default-scope'].join(':');
  return useAsyncResource(fetch, key);
};
