/**
 * @file: VehicleReportChange.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export interface VehicleReportChange {
  id: string;
  type: string;
  timestamp: Date;
  reason: string | null;
  content: any;
}
