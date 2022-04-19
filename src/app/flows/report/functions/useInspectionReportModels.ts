/**
 * @file: useInspectionReport.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import {
  InspectionResultFormatter,
  toMediaObject,
} from '@euler/app/flows/report/functions';
import {
  getDefectiveLevel,
  getDefectiveLevelTokenByValue,
} from '@euler/functions';
import { DefectiveLevel, MediaObject } from '@euler/model';
import {
  AbnormalLevel,
  SeverityLevel,
  SiteInspectionType,
} from '@euler/model/enum';
import { InspectionReportItem, VehicleReport } from '@euler/model/report';
import { arr2groupmap } from '@euler/utils/array';
import { comparator } from 'ramda';
import { useMemo } from 'react';

type ItemModel = {
  name: string;
  label: string;
  defectiveLevel: DefectiveLevel;
  description?: string;
};

// https://stackoverflow.com/questions/64181463/how-can-i-reference-to-a-type-which-is-part-of-a-union-type-in-typescript
export type CellType<
  T extends CellModel['type'],
  Model = CellModel,
> = Model extends { type: T } ? Model : never;

export type CellModel = { id: string } & (
  | {
      type: 'score';
      score: number;
    }
  | {
      type: 'group-header';
      title: string;
      description: string;
      defectiveLevel: DefectiveLevel;
      count: number;
    }
  | {
      type: 'section';
      index: number;
      title: string;
      defectiveLevel: DefectiveLevel;
      medias: MediaObject[];
      items: ItemModel[];
    }
);

type DefectiveGroupInfo = {
  title: string;
  description: string;
};

const DefectiveGroupInfoMap: { [p in DefectiveLevel]: DefectiveGroupInfo } = {
  [DefectiveLevel.Fine]: {
    title: '正常结果',
    description: '以下部位经检测均正常, 请继续持续关注爱车健康状况',
  },
  [DefectiveLevel.Defective]: {
    title: '轻微异常',
    description: '轻微异常或损坏, 可修(换)可不修(换), 不影响正常行驶',
  },
  [DefectiveLevel.Warning]: {
    title: '建议处理',
    description:
      '明显异常或损坏, 不影响当前行驶, 不会造成更严重后果(非行驶安全部位)',
  },
  [DefectiveLevel.Urgent]: {
    title: '急需处理',
    description:
      '明显异常或损坏, 影响正常行驶(影响行驶安全)或后续增加维修成本部件',
  },
};

type ResultGroup = {
  defectiveLevel: DefectiveLevel;
  sections: ResultSection[];
};

type ResultSection = {
  title: string;
  defectiveLevel: DefectiveLevel;
  items: InspectionReportItem[];
};

export function useInspectionReportModels(report: VehicleReport): {
  cells: CellModel[];
} {
  return useMemo(() => {
    const cells: CellModel[] = [];

    // score cell
    cells.push({
      id: 'score-cell',
      type: 'score',
      score: report.score ?? 0,
    });

    const groups = resultGroupsByDefectiveLevel(report);

    for (const group of groups) {
      // group header cell
      const groupToken = getDefectiveLevelTokenByValue(group.defectiveLevel);
      const groupInfo = DefectiveGroupInfoMap[group.defectiveLevel];
      cells.push({
        type: 'group-header',
        id: `group/${groupToken}/header`,
        title: groupInfo.title,
        description: groupInfo.description,
        count: group.sections.length,
        defectiveLevel: group.defectiveLevel,
      });

      group.sections.forEach((section, index) => {
        const medias: MediaObject[] = [];
        const items: ItemModel[] = [];

        for (const item of section.items) {
          medias.push(...item.medias.map(x => toMediaObject(x)));
          const name =
            InspectionResultFormatter.getInspectedItemDisplayName(item);
          const label = InspectionResultFormatter.formatLabel(item);
          const defectiveLevel = getDefectiveLevel(
            item.abnormalLevel,
            item.severityLevel,
          );
          const description =
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            item.abnormalDescription ||
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            item.resultRemark ||
            '暂无相关故障影响说明';
          items.push({
            name,
            label,
            defectiveLevel,
            description: description.trim(),
          });
        }

        // section cell
        cells.push({
          type: 'section',
          id: `group/${groupToken}/section/${index}`,
          index,
          title: section.title,
          defectiveLevel: section.defectiveLevel,
          medias,
          items,
        });
      });
    }

    return { cells };
  }, [report]);
}

// divide the inspection result items to groups by defective level
// with each group further divided by maintenance advice or item name (for
// normal inspection results).
function resultGroupsByDefectiveLevel(
  report: VehicleReport,
  includeFineInDefective = false,
): ResultGroup[] {
  const groups: ResultGroup[] = [];

  const sectionFor = (defectiveLevel: DefectiveLevel, title: string) => {
    let group = groups.find(x => x.defectiveLevel === defectiveLevel);
    if (!group) {
      group = {
        defectiveLevel,
        sections: [],
      };
      groups.push(group);
    }
    let section = group.sections.find(x => x.title === title);
    if (!section) {
      section = {
        title,
        items: [],
        defectiveLevel: DefectiveLevel.Fine, // default defective level
      };
      group.sections.push(section);
    }
    return section;
  };

  const items =
    report.inspection?.items.filter(
      x => x.inspectionType === SiteInspectionType.Default,
    ) ?? [];

  // first group the items by site.
  const defectiveItems: typeof items[0][] = [];
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const groupsBySiteMap = arr2groupmap(items, x => x.siteName || '未知部位');

  const isFine = (item: InspectionReportItem) =>
    item.abnormalLevel === AbnormalLevel.Fine;

  const defectiveSiteIdSet = new Set(
    items.filter(x => !isFine(x) && x.siteId).map(x => x.siteId!),
  );

  const addFineItems = (title: string, ...list: InspectionReportItem[]) => {
    list = list.filter(x => !x.siteId || !defectiveSiteIdSet.has(x.siteId));
    if (!list.length) return;
    const section = sectionFor(DefectiveLevel.Fine, title);
    section.items.push(...list);
  };

  for (const [siteName, list] of groupsBySiteMap) {
    if (includeFineInDefective) {
      if (list.every(x => x.abnormalLevel === AbnormalLevel.Fine)) {
        addFineItems(siteName, ...list);
      } else {
        const labels = list
          .filter(x => !isFine(x))
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          .map(x => x.label || x.maintenanceAdvice || '')
          .filter(x => x);
        if (labels.length === 1) {
          for (const item of list) {
            if (isFine(item)) {
              item.maintenanceAdvice = labels[0];
            }
          }
          defectiveItems.push(...list);
        } else {
          for (const item of list) {
            if (isFine(item)) {
              addFineItems(siteName, item);
            } else {
              defectiveItems.push(item);
            }
          }
        }
      }
    } else {
      for (const item of list) {
        if (isFine(item)) {
          addFineItems(siteName, item);
        } else {
          defectiveItems.push(item);
        }
      }
    }
  }

  const groupMapByTitle = arr2groupmap(
    defectiveItems,
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    x => x.label || x.maintenanceAdvice || '',
  );
  for (const [title, list] of groupMapByTitle) {
    const defectiveLevel: DefectiveLevel = list.some(
      x => x.severityLevel === SeverityLevel.Danger,
    )
      ? DefectiveLevel.Urgent
      : list.some(x => x.severityLevel === SeverityLevel.Warning)
      ? DefectiveLevel.Warning
      : DefectiveLevel.Defective;
    const section = sectionFor(defectiveLevel, title);
    section.defectiveLevel = defectiveLevel;
    section.items.push(...list);
    section.items.sort((x, y) => y.severityLevel - x.severityLevel);
  }

  const fineGroup = groups.find(x => x.defectiveLevel === DefectiveLevel.Fine);
  if (fineGroup) {
    // sort the sections in the group by media counts
    const cardinality = (list: InspectionReportItem[]) => {
      return list.reduce((res, item) => res + (item.medias?.length ?? 0), 0);
    };
    fineGroup.sections.sort((x, y) => {
      const [a, b] = [cardinality(x.items), cardinality(y.items)];
      return a > b ? -1 : a < b ? 1 : 0;
    });
  }

  groups.sort(comparator((x, y) => x.defectiveLevel > y.defectiveLevel));

  return groups;
}
