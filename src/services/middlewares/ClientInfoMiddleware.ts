/**
 * @file: ClientIdMiddleware.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { Middleware } from '@euler/lib/request/Middleware';
import { RequestContext } from '@euler/lib/request/types';
import { getCommonRequestParameters } from '@euler/services/utils';

export class ClientInfoMiddleware implements Middleware {
  async pre(context: RequestContext): Promise<void> {
    const { clientId, clientVersion, nonce, timestamp, digest } =
      await getCommonRequestParameters();
    context.init.headers = {
      ...context.init.headers,
      ['X-Client-Id']: clientId,
      ['X-Client-Version']: clientVersion,
      ['X-Request-Nonce']: nonce,
      ['X-Request-Timestamp']: String(timestamp),
      ['X-Request-Digest']: digest,
    };
  }
}
