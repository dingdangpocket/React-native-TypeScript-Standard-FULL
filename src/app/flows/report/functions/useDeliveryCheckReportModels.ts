/**
 * @file: useDeliveryCheckReportModels.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { toMediaObject } from '@euler/app/flows/report/functions';
import { MediaObject } from '@euler/model';
import { VehicleReport } from '@euler/model/report';
import { useMemo } from 'react';

export type DeliveryCheckCellModel = {
  index: number;
  title: string;
  technicianName: string;
  medias: MediaObject[];
  remark: string;
};

export function useDeliveryCheckReportModels(report: VehicleReport) {
  return useMemo(() => {
    const items = report.deliveryCheck?.items ?? [];
    const cells = items.map((item, index) => {
      const cell: DeliveryCheckCellModel = {
        index,
        title: item.title,
        technicianName: item.technicianName ?? '',
        medias: item.medias.map(toMediaObject),
        remark:
          item.remark && item.remark !== '暂无备注'
            ? item.remark
            : '检查合格符合交车标准',
      };
      return cell;
    });
    return { cells };
  }, [report]);
}
