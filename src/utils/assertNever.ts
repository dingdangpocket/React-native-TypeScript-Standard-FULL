/**
 * @file: assertNever.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
export function assertNever(_: never, msg?: string): never {
  throw new Error(msg ?? 'Unexpected unhandled value: ' + _);
}
