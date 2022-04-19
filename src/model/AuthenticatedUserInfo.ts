/**
 * @file: AuthenticatedUserInfo.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { Organization, Store } from './entity';
import { UserInfo } from './UserInfo';

export type AuthenticatedUserInfo = {
  user: UserInfo;
  org: Organization;
  store: Store;
};
