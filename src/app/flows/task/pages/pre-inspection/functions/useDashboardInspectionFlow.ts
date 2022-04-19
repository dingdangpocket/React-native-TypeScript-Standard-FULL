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
import { sentry } from '@euler/lib/integration/sentry';
import { InspectionTemplate } from '@euler/model';
import {
  AbnormalLevel,
  InspectionTemplateSceneType,
  OptionValueType,
  SeverityLevel,
  SiteInspectionType,
} from '@euler/model/enum';
import { useServiceFactory } from '@euler/services/factory';
import { isNotNull } from '@euler/utils';
import { useBehaviorSubject } from '@euler/utils/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';

const findMostAppropriateTemplate = (
  templates: InspectionTemplate[],
): InspectionTemplate | undefined => {
  // todo: find the most appropriate template
  return templates[0];
};

export const useDashboardInspectionFlow = () => {
  const user = useCurrentUser();
  const { taskNo, detail, taskManager } = useTaskContext();
  const { taskService } = useServiceFactory();
  const [inventory] = useInventory();
  const { getSiteById } = useInventoryLookup(inventory);
  const [sites, setSites] = useState<InspectionSiteInfo[]>();
  const [error, setError] = useState<Error>();
  const [siteIdsBeingCommitted] = useBehaviorSubject(
    taskManager.preInspectionManager.siteIdsBeingCommited$,
  );

  const templates = useInspectionTemplates({
    scene: InspectionTemplateSceneType.Dashboard,
  });

  const dashboardTemplate = useMemo<InspectionTemplate | undefined>(
    () => findMostAppropriateTemplate(templates),
    [templates],
  );

  const dashboardInspectionFlow = useMemo(
    () =>
      dashboardTemplate == null
        ? undefined
        : detail.preInspection.flows.find(
            x => x.template.originTemplateId === dashboardTemplate.id,
          ),
    [dashboardTemplate, detail.preInspection.flows],
  );

  useEffect(
    () => () => {
      if (!sites) return;
      for (const site of sites) {
        taskManager.preInspectionManager.endSiteInspection(site.id);
      }
    },
    [sites, taskManager.preInspectionManager],
  );

  useEffect(() => {
    if (!dashboardTemplate) return;

    if (!dashboardInspectionFlow) {
      taskManager.inspectionManager
        .addInspectionFlow({
          templateId: dashboardTemplate.id,
          assignToMemberId: user!.user.memberId,
        })
        .catch(err => {
          sentry.captureException(err);
          setError(err);
        });
    } else {
      const group =
        dashboardInspectionFlow.template.conf.categories?.[0]?.groups?.[0];
      if (group?.siteIds) {
        const list = group.siteIds
          .map(siteId => getSiteById(siteId))
          .filter(isNotNull);
        setSites(list);
        for (const site of list) {
          taskManager.preInspectionManager.beginSiteInspection({
            site,
            inspectionType: SiteInspectionType.Dashboard,
            technicianId: user!.user.memberId,
            technicianName: user!.user.name,
          });
        }
      }
    }
  }, [
    dashboardInspectionFlow,
    dashboardTemplate,
    getSiteById,
    taskManager.inspectionManager,
    taskManager.preInspectionManager,
    taskNo,
    taskService,
    user,
  ]);

  const isSiteInspectionResultBeingCommitted = useCallback(
    (siteId: number) => {
      return siteIdsBeingCommitted.has(siteId);
    },
    [siteIdsBeingCommitted],
  );

  const commitInspectionResult = async (
    siteId: number,
    isDefective: boolean,
  ) => {
    const site = getSiteById(siteId);
    const siteInspectionManager =
      taskManager.preInspectionManager.getSiteInspectionManager(siteId);
    if (!site || !siteInspectionManager) return;

    const checkItem = site.checkItems[0];
    if (!checkItem) {
      console.error('check item does not exist');
      return;
    }

    const normalOption = checkItem.options.find(
      x => x.abnormalLevel === AbnormalLevel.Fine,
    );
    const abnormalOption = checkItem.options.find(
      x => x.abnormalLevel !== AbnormalLevel.Fine,
    );

    const abnormalLevel = isDefective
      ? abnormalOption?.abnormalLevel ?? AbnormalLevel.Defective
      : normalOption?.abnormalLevel ?? AbnormalLevel.Fine;
    const severityLevel = isDefective
      ? abnormalOption?.severityLevel ?? SeverityLevel.Warning
      : normalOption?.severityLevel ?? SeverityLevel.None;
    const resultDataStringValue = isDefective
      ? abnormalOption?.label ?? '已点亮'
      : normalOption?.label ?? '未点亮';

    siteInspectionManager.produceItemAt(0, draft => {
      if (draft.type !== 'item') return;

      draft.abnormalLevel = abnormalLevel;
      draft.severityLevel = severityLevel;
      draft.result = {
        valueType: OptionValueType.String,
        value: resultDataStringValue,
      };
    });

    try {
      await siteInspectionManager.commit();
    } catch (e) {
      alert((e as Error).message);
    }
  };

  return {
    dashboardSites: sites,
    dashboardInspectionFlow,
    commitInspectionResult,
    isSiteInspectionResultBeingCommitted,
    error,
  };
};
