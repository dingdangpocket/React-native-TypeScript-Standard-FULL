/**
 * @file: sleep.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
