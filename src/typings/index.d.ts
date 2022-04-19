/**
 * @file: types.d.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export type InstanceOrFactory<T> = T extends { (...args: any[]): any }
  ? never
  : T | ((...args: any[]) => T);

export type Optional<T> = { [K in keyof T]+?: T[K] };
