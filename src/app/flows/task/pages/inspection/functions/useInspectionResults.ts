/**
 * @file: useInspectionResults.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useTaskContext } from '@euler/app/flows/task/functions/TaskContext';
import { InspectionResults, VehicleInspectedSiteInfo } from '@euler/model';
import { useCallback, useMemo } from 'react';

export const useInspectionResults = () => {
  const { detail } = useTaskContext();

  const inspectionResults = useMemo<InspectionResults>(() => {
    // populate the initial inspection results from task detail.
    // VehicleInspectedSiteInfo[]
    const inspectedSites =
      detail.inspectedSites?.map<VehicleInspectedSiteInfo>(inspectedSite => {
        return {
          ...inspectedSite,
          customIssues: detail.customIssues?.filter(
            x => x.siteId === inspectedSite.siteId,
          ),
        };
      }) ?? [];
    const customIssues = detail.customIssues?.filter(x => !x.siteId);
    return { inspectedSites, customIssues };
  }, [detail.customIssues, detail.inspectedSites]);

  const getSiteInspectedResults = useCallback(
    (siteId: number) => {
      return inspectionResults.inspectedSites.find(x => x.siteId === siteId);
    },
    [inspectionResults.inspectedSites],
  );

  return {
    inspectionResults,
    getSiteInspectedResults,
  };
};
