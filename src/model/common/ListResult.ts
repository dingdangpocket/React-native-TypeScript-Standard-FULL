/**
 * @file: ListResult.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export interface ListResult<T> {
  total: number;
  items: T[];
}
