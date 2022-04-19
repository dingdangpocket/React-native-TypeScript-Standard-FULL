/**
 * @file: Identity.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export interface Identity {
  authenticated: boolean;
  userId: number;
  userName: string;
  acl: string[];
}
