/**
 * @file: AuthenticationInvalidationMiddleware.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { sessionExpired$ } from '@euler/functions/sessionTracking';
import { ResponseContext } from '@euler/lib/request';
import { Middleware } from '@euler/lib/request/Middleware';

export class AuthenticationInvalidationMiddleware implements Middleware {
  async post(context: ResponseContext) {
    if (context.response.status === 403) {
      sessionExpired$.next();
    }
  }
}
