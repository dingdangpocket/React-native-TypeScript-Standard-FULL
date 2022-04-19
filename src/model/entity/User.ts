/**
 * @file: User.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { Gender } from '../enum';

export interface User {
  id: number;
  nick: string;
  avatarUrl?: string | null;
  gender?: Gender | null;
  country?: string | null;
  province?: string | null;
  city?: string | null;
  language?: string | null;
  mobile?: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
}
