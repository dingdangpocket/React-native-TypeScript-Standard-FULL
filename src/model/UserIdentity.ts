/**
 * @file: UserIdentity.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export type UserIdentity = {
  userIdLong: number;
  uid: string;
  userName: string;
  nick?: string;
  email?: string;
} & {
  [p: string]: any;
};
