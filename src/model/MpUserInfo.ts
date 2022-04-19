/**
 * @file: MpUserInfo.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export interface MpUserInfo {
  openid: string;
  unionid?: string;
  nickname?: string;
  sex?: string;
  province?: string;
  city?: string;
  country?: string;
  headimgurl?: string;
  privilege?: string[];
}
