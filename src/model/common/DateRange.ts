/**
 * @file: DateRange.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export interface DateRange {
  startDate: string | Date;
  endDate: string | Date;
  startInclusive?: boolean;
  endInclusive?: boolean;
}
