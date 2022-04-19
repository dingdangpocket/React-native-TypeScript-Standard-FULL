/**
 * @file: useInspectionTemplates.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { InspectionTemplate } from '@euler/model';
import {
  InspectionCategory,
  InspectionTemplateSceneType,
  ResourceAccessScope,
} from '@euler/model/enum';
import { useServiceFactory } from '@euler/services/factory';
import { useAsyncResource } from '@euler/utils/hooks';
import { useCallback } from 'react';

export const isInspectionTemplateNominatedFor = (
  category: InspectionCategory,
  template: InspectionTemplate,
) => {
  if (category === InspectionCategory.Pre) {
    return (
      template.sceneType === InspectionTemplateSceneType.Facade ||
      template.sceneType === InspectionTemplateSceneType.Dashboard ||
      template.sceneType === InspectionTemplateSceneType.Custom
    );
  } else {
    return (
      template.sceneType === InspectionTemplateSceneType.Basic ||
      template.sceneType === InspectionTemplateSceneType.Full ||
      template.sceneType === InspectionTemplateSceneType.Custom
    );
  }
};

export const useInspectionTemplates = (
  props: {
    scope?: ResourceAccessScope;
    scene?: InspectionTemplateSceneType;
  } = {},
) => {
  const { scope, scene } = props;
  const { inventoryService } = useServiceFactory();
  const fetch = useCallback(() => {
    return inventoryService.getTemplates({ scope, scene });
  }, [inventoryService, scope, scene]);
  const key = [
    'inspection-templates',
    scope ?? 'default-scope',
    scene ?? 'none',
  ].join(':');
  return useAsyncResource(fetch, key);
};
