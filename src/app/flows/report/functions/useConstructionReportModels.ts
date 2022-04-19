/**
 * @file: useConstructionReportModels.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { toMediaObject } from '@euler/app/flows/report/functions';
import { getDefectiveLevel } from '@euler/functions';
import { DefectiveLevel, MediaObject } from '@euler/model';
import {
  ConstructionReportItemDetail,
  VehicleReport,
} from '@euler/model/report';
import { comparer } from '@euler/utils';
import { useMemo } from 'react';

export type ConstructionCellModel = {
  index: number;
  name: string;
  technicianName: string;
  count: number;
  details: ConstructionItemDetailModel[];
  procedures: ConstructionProcedureModel[];
};

type ConstructionItemDetailModel = {
  title: string;
  defectiveLevel: DefectiveLevel;
};

type ConstructionProcedureModel = {
  name: string;
  medias: MediaObject[];
};

export function useConstructionReportModels(report: VehicleReport) {
  return useMemo(() => {
    const cells: ConstructionCellModel[] = [];

    const items = report.construction?.items ?? [];

    items.forEach((item, index) => {
      const medias = (item.medias || []).map(x => {
        if (x.procedure) return x;

        const media = { ...x };
        if (!media.procedure) {
          if (media.category === 'procedure') {
            media.procedure = '施工过程';
            media.procedureOrder = -1;
          } else if (media.category === 'comparison') {
            media.procedure = '施工对比';
            media.procedureOrder = -2;
          }
          media.isLegacy = true;
        }
        return media;
      });

      medias.sort((x, y) =>
        comparer(x.procedureOrder ?? 0, y.procedureOrder ?? 0),
      );

      const details: ConstructionItemDetailModel[] = item.details.map(
        detail => ({
          title: constructionDetailItemTitle(detail),
          defectiveLevel: getDefectiveLevel(
            detail.abnormalLevel,
            detail.severityLevel,
          ),
        }),
      );

      const procedures: ConstructionProcedureModel[] = [];
      for (const media of medias) {
        const name = media.procedure!;
        let procedure = procedures.find(x => x.name === name);
        if (!procedure) {
          procedure = { name, medias: [] };
          procedures.push(procedure);
        }
        procedure.medias.push(toMediaObject(media));
      }

      cells.push({
        index,
        name: item.name,
        technicianName:
          item.technicianName ?? report.construction?.technicianName ?? '',
        count: medias.length,
        details,
        procedures,
      });
    });

    return { cells };
  }, [report]);
}

function constructionDetailItemTitle(detail: ConstructionReportItemDetail) {
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const [x, y] = [detail.itemName || detail.siteName || '', detail.label || ''];
  if (!x) return y;
  if (y.startsWith(x)) {
    return [x, y.substring(x.length).replace(/^\s*[:：]\s*/, '')].join(': ');
  }
  const m = /^(.*?[:：]\s*)/.exec(y);
  if (m) {
    return [x, y.substring(m[1].length)].join(': ');
  }
  return [x, y].join(': ');
}
