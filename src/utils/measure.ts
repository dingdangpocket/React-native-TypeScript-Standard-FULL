/**
 * @file: measure.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export async function measure<T>(
  routine: () => Promise<T>,
  label?: string,
): Promise<T> {
  const start = performance.now();
  const result = await routine();
  const end = performance.now();
  console.log(`${label ?? 'measure'}: ${end - start}ms taken`);
  return result;
}
