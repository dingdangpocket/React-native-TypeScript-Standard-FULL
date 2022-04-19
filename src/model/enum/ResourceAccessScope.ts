/**
 * @file: ResourceAccessScope.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
export enum ResourceAccessScope {
  Global = 'global',
  Org = 'org',
  Store = 'store',
}

export const ResourceAccessScopeValueSet = new Set([
  ResourceAccessScope.Global,
  ResourceAccessScope.Org,
  ResourceAccessScope.Store,
]);
