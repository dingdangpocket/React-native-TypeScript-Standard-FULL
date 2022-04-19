/**
 * @file: AuthTokenMiddleware.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { Middleware } from '@euler/lib/request/Middleware';
import { RequestContext } from '@euler/lib/request/types';
import { StorageService } from '@euler/lib/services/storage.service';
import { TokenService } from '@euler/lib/services/token.service';
import { SecureStorageProvider } from '@euler/lib/storage/impl/SecureStorageProvider';

export class AuthTokenMiddleware implements Middleware {
  private readonly tokenService: TokenService;

  constructor() {
    const storageService = new StorageService(SecureStorageProvider.shared);
    this.tokenService = new TokenService(storageService);
  }

  async getToken() {
    return await this.tokenService.getToken();
  }

  async pre(context: RequestContext): Promise<void> {
    const token = await this.getToken();
    if (token) {
      context.init.headers = {
        ...context.init.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }
}
