/**
 * @file: sha256.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import * as Crypto from 'expo-crypto';

export async function sha256(s: string): Promise<string> {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    s,
  );
  return digest;
}
