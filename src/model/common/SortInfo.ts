/**
 * @file: SortInfo.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export type SortDirection = 'asc' | 'desc';

export interface SortInfo {
  property: string;
  dir: SortDirection | undefined | null | '';
}
