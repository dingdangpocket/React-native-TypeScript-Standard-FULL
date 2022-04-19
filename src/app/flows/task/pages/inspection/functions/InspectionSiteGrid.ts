/**
 * @file: inspectionSiteGridUtil.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { getDefectiveLevel } from '@euler/functions';
import { InventoryQuery } from '@euler/functions/useInventory';
import { DefectiveLevel, InspectionTemplateSnapshot } from '@euler/model';
import { CustomIssue, SiteInspection } from '@euler/model/task-detail';
import { SiteGirdItemTag } from '@euler/typings/styled';
import { isNotNull } from '@euler/utils';
import { array2map, uniq } from '@euler/utils/array';

export const kDefaultHardwareCapableGroupId = '__hardware__';
export const kCustomIssueGroupId = '__custom_issues__';
export const kDefaultHardwareGroupName = '硬件项目';
export const kCustomIssueGroupName = '自定义部位';

export type ItemInfo = {
  itemType: 'site' | 'custom-issue';
  isHardwareCapable: boolean;
  groupId: string;
  siteId: number;
  code: string;
  customIssueId?: number;
  name: string;
  icon?: string;
  iconType?: 'image' | 'svg';
  defectiveLevel?: DefectiveLevel;
  tag?: SiteGirdItemTag;
};

export type GroupSectionDataItem = { groupId: string; items: ItemInfo[] };

export type GroupSection = {
  title: string;
  groupId: string;
  index: number;
  data: [GroupSectionDataItem];
  hiddenSites?: ItemInfo[];
};

export function buildGroupSectionsFromTemplate(
  inventoryQuery: InventoryQuery,
  template: InspectionTemplateSnapshot,
  inspectedSites?: SiteInspection[],
  customIssues?: CustomIssue[],
  simulateTooManySections?: boolean,
): GroupSection[] {
  const groups = template.conf.categories.flatMap(x => x.groups);
  const inspectedSiteMap = array2map(inspectedSites ?? [], x => x.siteId);

  const mapSite = (groupId: string, siteId: number) => {
    const site = inventoryQuery.getSiteById(siteId);
    if (!site) return null;
    const inspectedSite = inspectedSiteMap.get(siteId);
    const item: ItemInfo = {
      itemType: 'site',
      isHardwareCapable: site.supportsIdevice,
      groupId,
      siteId,
      code: site.code,
      name: site.name,
      icon: site.iconUrl ?? undefined,
      iconType: site.iconUrl
        ? site.iconUrl.includes('.svg')
          ? 'svg'
          : 'image'
        : undefined,
      defectiveLevel: inspectedSite
        ? getDefectiveLevel(
            inspectedSite.abnormalLevel!,
            inspectedSite.severityLevel!,
          )
        : undefined,
      tag: site.supportsIdevice ? 'hardware-capable' : undefined,
    };
    return item;
  };

  let sections = groups.map(group => {
    const disabledSiteIdSet = new Set(group.disabledSiteIds ?? []);
    const defaultHiddenSiteIdSet = new Set(group.defaultHiddenSiteIds ?? []);

    // filter out disabled sites and the sites that should be hidden by default.
    const targetSiteIds: number[] = group.siteIds.filter(
      x => !disabledSiteIdSet.has(x) && !defaultHiddenSiteIdSet.has(x),
    );

    const expectedNumberOfSites = targetSiteIds.length;

    for (const defaultHiddenSiteId of group.defaultHiddenSiteIds ?? []) {
      // however, if the default hidden site has inspetion results and
      // it is not disabled, move it out to the visible grid area.
      // it's also moved out in case the expected number of sites is zero.
      if (
        (expectedNumberOfSites === 0 ||
          inspectedSiteMap.has(defaultHiddenSiteId)) &&
        !targetSiteIds.includes(defaultHiddenSiteId) &&
        !disabledSiteIdSet.has(defaultHiddenSiteId)
      ) {
        targetSiteIds.push(defaultHiddenSiteId);
      }
    }

    const mapFn = mapSite.bind(null, group.id);
    const items = targetSiteIds.map(mapFn).filter(isNotNull);

    const hiddenSiteIds = (group.defaultHiddenSiteIds ?? []).filter(
      x => !targetSiteIds.includes(x),
    );

    const section: GroupSection = {
      index: 0,
      title: group.name,
      groupId: group.id,
      data: [{ groupId: group.id, items }],
      hiddenSites: hiddenSiteIds.map(mapFn).filter(isNotNull),
    };

    return section;
  });

  // the list of hardware capable items which are intended to be
  // always displayed as the first section at the top.
  const hardwareCapableItems = uniq(
    sections.flatMap(x => x.data[0].items.filter(t => t.isHardwareCapable)),
    x => x.siteId,
  ).map(item => ({ ...item, groupId: kDefaultHardwareCapableGroupId }));

  if (hardwareCapableItems.length) {
    sections.unshift({
      index: 0,
      groupId: kDefaultHardwareCapableGroupId,
      title: kDefaultHardwareGroupName,
      data: [
        {
          groupId: kDefaultHardwareCapableGroupId,
          items: hardwareCapableItems,
        },
      ],
      hiddenSites: [],
    });
  }

  if (customIssues?.length) {
    sections.push({
      index: 0,
      groupId: kCustomIssueGroupId,
      title: kCustomIssueGroupName,
      data: [
        {
          groupId: kCustomIssueGroupId,
          items: customIssues
            .filter(x => !x.siteId)
            .map(customIssue => ({
              itemType: 'custom-issue',
              isHardwareCapable: false,
              groupId: kCustomIssueGroupId,
              siteId: 0,
              code: '',
              customIssueId: customIssue.id,
              name: customIssue.siteName,
              defectiveLevel: getDefectiveLevel(
                customIssue.abnormalLevel,
                customIssue.severityLevel,
              ),
            })),
        },
      ],
    });
  }

  // don't show section w/o any items.
  sections = sections.filter(x => x.data[0].items.length > 0);

  if (simulateTooManySections) {
    const clone = sections.map(x => ({
      ...x,
      groupId: x.groupId + '_clone',
      title: x.title + '副本',
      data: x.data.map(entry => ({
        groupId: entry.groupId,
        items: entry.items.map(t => ({
          ...t,
          groupId: x.groupId + '_clone',
        })),
      })),
    })) as GroupSection[];
    sections.push(...clone);
  }

  // assign index to each section.
  sections.forEach((x, index) => (x.index = index));

  return sections;
}
