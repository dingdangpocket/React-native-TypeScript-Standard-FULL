/**
 * @file: auth.service.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { HttpClient } from '@euler/lib/request';
import { AuthenticatedUserInfo } from '@euler/model';
import { AuthenticatorResult, AuthProvider } from '@euler/model/auth';

export class AuthService {
  constructor(private readonly api: HttpClient) {}

  async login<T extends AuthProvider>(
    authProviderData: T,
  ): Promise<AuthenticatorResult<T>> {
    return await this.api
      .post()
      .url('/auth/login')
      .data({ data: authProviderData })
      .future();
  }

  async getAuthenticatedUserInfo(): Promise<AuthenticatedUserInfo | null> {
    return await this.api.get().url('/auth/user').future();
  }
}
