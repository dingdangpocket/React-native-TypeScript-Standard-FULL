/**
 * @file: useServiceAgentList.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useCurrentStoreId } from '@euler/app/flows/auth';
import { OrgMember } from '@euler/model/entity';
import { useServiceFactory } from '@euler/services/factory';
import { useAsyncResource } from '@euler/utils/hooks';
import { useCallback } from 'react';

export const useServiceAgentList = (initialValues?: OrgMember[] | null) => {
  const { storeService } = useServiceFactory();
  const fetch = useCallback(
    () => storeService.listServiceAgents(),
    [storeService],
  );
  const storeId = useCurrentStoreId()!;
  return useAsyncResource(
    fetch,
    `store/${storeId}/service-agents`,
    initialValues,
  );
};
