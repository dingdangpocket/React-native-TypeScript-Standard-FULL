/**
 * @file: index.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { AuthenticatedUserInfo } from '@euler/model';

export enum AuthProviderType {
  Password = 'password',
  Phone = 'phone',
  Weixin = 'weixin',
}

export const AuthProviderTypeSet = new Set([
  AuthProviderType.Password,
  AuthProviderType.Phone,
]);

export type PasswordAuthProvider = {
  type: AuthProviderType.Password;
  userName: string;
  password: string;
};

export type PhoneAuthProvider = {
  type: AuthProviderType.Phone;
  phone: string;
  ticket: string;
  verifyCode: string;
};

export type WeixinAuthProvider = {
  type: AuthProviderType.Weixin;
  appId: string;
  nonce: string;
  credential:
    | { type: 'code'; code: string }
    | {
        type: 'phone';
        phone: string;
        ticket: string;
        verifyCode: string;
      };
};

export type AuthProvider =
  | PasswordAuthProvider
  | PhoneAuthProvider
  | WeixinAuthProvider;

export type AuthenticatorResult<T extends AuthProvider> =
  AuthenticatedUserInfo & {
    token: string;
    extra?: any;
  } & (T extends { type: AuthProviderType.Password }
      ? { requiresChangePassword: boolean }
      : // eslint-disable-next-line @typescript-eslint/ban-types
        {});
