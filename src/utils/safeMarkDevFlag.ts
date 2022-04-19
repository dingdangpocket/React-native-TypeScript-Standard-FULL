/**
 * Call this method to turn on some flags safely in dev only.
 * In production mode, this flag will always be false.
 * @param flagForDev the flag used for dev purpose only
 * @returns the current flag value
 */
export function safeMarkDevFlag(flagForDev: boolean) {
  return __DEV__ ? flagForDev : false;
}
