/**
 * @file: usePreInspectionResults.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { Overlay } from '@euler/app/flows/report/components/VehicleFacadeBirdView.shared';
import { toMediaObject } from '@euler/app/flows/report/functions/mediaInfoToMediaObject';
import { getDefectiveLevel } from '@euler/functions';
import {
  DefectiveLevel,
  FacdeSiteConfigurationMapByName,
  FacdeSiteConfigurations,
  MediaObject,
} from '@euler/model';
import { AbnormalLevel, SiteInspectionType } from '@euler/model/enum';
import { PreInspectionReport } from '@euler/model/report';
import { useMemo } from 'react';

export type ResultGroup = {
  name: string;
  code?: string | null;
  defectiveLevel: DefectiveLevel;
  medias: MediaObject[];
};

export function usePreInspectionResults(
  report: PreInspectionReport | null | undefined,
) {
  return useMemo(() => {
    const items = (report?.items ?? [])
      .filter(
        x =>
          x.inspectionType === SiteInspectionType.Facade ||
          (x.siteName && FacdeSiteConfigurationMapByName.has(x.siteName)),
      )
      .filter(x => x.abnormalLevel !== AbnormalLevel.Fine);

    const groups: ResultGroup[] = [];

    for (const item of items) {
      const name = item.siteName!;
      const defectiveLevel = getDefectiveLevel(
        item.abnormalLevel,
        item.severityLevel,
      );
      let group = groups.find(x => x.name === name);
      if (!group) {
        group = {
          name,
          code: item.siteCode,
          medias: [],
          defectiveLevel: DefectiveLevel.Fine,
        };
        groups.push(group);
      }
      if (group.defectiveLevel < defectiveLevel) {
        group.defectiveLevel = defectiveLevel;
      }
      if (item.medias.length) {
        for (const media of item.medias) {
          group.medias.push(toMediaObject(media));
        }
      }
    }

    const groupsWithIssues = groups.filter(
      x => x.defectiveLevel !== DefectiveLevel.Fine,
    );
    const normalSites = groups
      .filter(x => x.defectiveLevel === DefectiveLevel.Fine)
      .map(x => FacdeSiteConfigurations.find(c => c.code === x.code)!)
      .filter(x => x);

    const overlays: Overlay[] = [];
    const map = FacdeSiteConfigurationMapByName;
    for (const group of groupsWithIssues) {
      if (!map.has(group.name)) continue;
      const configuration = map.get(group.name)!;
      const color =
        group.defectiveLevel === DefectiveLevel.Urgent ? '#e0463d' : '#ff8a00';
      overlays.push({
        name: configuration.name,
        imagePath: configuration.overlay,
        coords: configuration.coords,
        color,
      });
    }

    return {
      groupsWithIssues,
      normalSites,
      overlays,
    };
  }, [report?.items]);
}
