/**
 * @file: maybeFactoryValue.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

type FactoryFunction<T> = { (...args: any[]): T };

export type FactoryOrValue<T> = T | FactoryFunction<T>;

function isFactory<T>(
  value: T | FactoryFunction<T>,
): value is FactoryFunction<T> {
  return typeof value === 'function';
}

export function maybeFactoryValue<T>(
  value: T | FactoryFunction<T> | undefined,
  ...args: any[]
): T | undefined {
  if (isFactory(value)) {
    return value(...args);
  }
  return value;
}
