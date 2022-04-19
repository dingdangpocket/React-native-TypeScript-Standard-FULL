/**
 * @file: useMemberList.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { useCurrentStoreId } from '@euler/app/flows/auth';
import { OrgMember } from '@euler/model/entity';
import { OrgUserRoleType } from '@euler/model/enum';
import { useServiceFactory } from '@euler/services/factory';
import { useAsyncResource } from '@euler/utils/hooks';
import { useCallback } from 'react';

export const useMemberList = (
  role?: OrgUserRoleType,
  initialValues?: OrgMember[] | null,
) => {
  const { storeService } = useServiceFactory();
  const fetch = useCallback(
    () => storeService.listMembers({ role }),
    [role, storeService],
  );
  const storeId = useCurrentStoreId()!;
  return useAsyncResource(
    fetch,
    `store/${storeId}/members/${role ?? '__all__'}`,
    initialValues,
  );
};
