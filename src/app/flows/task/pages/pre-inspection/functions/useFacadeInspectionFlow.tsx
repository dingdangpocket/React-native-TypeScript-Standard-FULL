/**
 * @file: useDashboardInspectionFlow.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useCurrentUser } from '@euler/app/flows/auth';
import { useInspectionTemplates } from '@euler/app/flows/task/functions';
import { useTaskContext } from '@euler/app/flows/task/functions/TaskContext';
import {
  InspectionSiteInfo,
  useInventory,
  useInventoryLookup,
} from '@euler/functions/useInventory';
import {
  InspectionTemplateSceneType,
  SiteInspectionType,
} from '@euler/model/enum';
import { isNotNull } from '@euler/utils';
import { useEffect, useMemo, useState } from 'react';

export const useFacadeInspectionFlow = () => {
  const user = useCurrentUser();
  const { detail, taskManager } = useTaskContext();
  const [inventory] = useInventory();
  const { getSiteById } = useInventoryLookup(inventory);
  const [facadeSites, setFacadeSites] = useState<InspectionSiteInfo[]>();
  const templates = useInspectionTemplates({
    scene: InspectionTemplateSceneType.Facade,
  });

  // todo: find the most appropriate facade template
  const templateId = useMemo(() => templates[0]?.id, [templates]);
  const facadeInspectionFlow = useMemo(
    () =>
      detail.preInspection.flows.find(
        x => x.template.originTemplateId === templateId,
      ),
    [detail.preInspection.flows, templateId],
  );

  useEffect(() => {
    if (!templateId) return;

    if (!facadeInspectionFlow) {
      taskManager.preInspectionManager
        .addInspectionFlow({
          templateId,
          assignToMemberId: user!.user.memberId,
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      const group =
        facadeInspectionFlow.template.conf.categories?.[0]?.groups?.[0];
      if (group?.siteIds) {
        const sites = group.siteIds
          .map(siteId => getSiteById(siteId))
          .filter(isNotNull);

        // begin site inspections for the target sites
        for (const site of sites) {
          taskManager.preInspectionManager.beginSiteInspection({
            site,
            inspectionType: SiteInspectionType.Facade,
            technicianId: user!.user.memberId,
            technicianName: user!.user.name,
          });
        }
        setFacadeSites(sites);
      }
    }
  }, [
    facadeInspectionFlow,
    getSiteById,
    taskManager.preInspectionManager,
    templateId,
    user,
  ]);

  useEffect(
    () => () => {
      if (!facadeSites) return;
      // tear down inspection context for the facade sites.
      for (const site of facadeSites) {
        taskManager.preInspectionManager.endSiteInspection(site.id);
      }
    },
    [facadeSites, taskManager.preInspectionManager],
  );

  return {
    facadeSites,
    facadeInspectionFlow,
  };
};
