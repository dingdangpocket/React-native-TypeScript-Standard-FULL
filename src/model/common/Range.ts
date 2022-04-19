/**
 * @file: Range.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export interface Range<T> {
  start: T | null | undefined;
  end: T | null | undefined;
  startInclusive: boolean;
  endInclusive: boolean;
}
