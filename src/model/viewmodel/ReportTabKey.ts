/**
 * @file: ReportTabKey.ts
 * @author: eric <eric.blueplus@gmail.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { VehicleReport } from '../report';

export type ReportTabKey = Extract<
  keyof VehicleReport,
  | 'preInspection'
  | 'inspection'
  | 'quotation'
  | 'construction'
  | 'deliveryCheck'
>;
