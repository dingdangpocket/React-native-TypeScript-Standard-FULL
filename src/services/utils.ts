/**
 * @file: utils.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { getSessionId } from '@euler/lib/session';
import { AuthTokenMiddleware } from '@euler/services/middlewares';
import * as Crypto from 'expo-crypto';
import { nanoid } from 'nanoid/non-secure';
import packageInfo from '../../package.json';

export async function getCommonRequestParameters() {
  const { sessionId } = await getSessionId();
  const nonce = nanoid(16);
  const timestamp = Math.round(Date.now() / 1000);
  const clientId = sessionId;
  const data = [nonce, clientId, timestamp].join('');
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    data,
    {
      encoding: Crypto.CryptoEncoding.BASE64,
    },
  );
  return {
    clientId,
    nonce: nonce,
    clientVersion: packageInfo.version,
    timestamp,
    digest,
  };
}

export async function getCommonRequestParametersAsSearchQuery(): Promise<
  Record<string, any>
> {
  const { clientId, clientVersion, nonce, timestamp, digest } =
    await getCommonRequestParameters();
  const tokenMiddleware = new AuthTokenMiddleware();
  const token = await tokenMiddleware.getToken();
  return {
    ['x-client-id']: clientId,
    ['x-client-version']: clientVersion,
    ['x-request-nonce']: nonce,
    ['x-request-timestamp']: timestamp,
    ['x-request-digest']: digest,
    token,
  };
}
