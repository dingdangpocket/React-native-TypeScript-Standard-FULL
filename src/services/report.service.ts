/**
 * @file: report.service.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { HttpClient } from '@euler/lib/request';
import { VehicleReport } from '@euler/model/report';

export class ReportService {
  constructor(private readonly api: HttpClient) {}

  async getReportDetail(reportNo: string): Promise<VehicleReport> {
    return await this.api
      .get()
      .url('/reports/:reportNo/detail', { reportNo })
      .future();
  }
}
