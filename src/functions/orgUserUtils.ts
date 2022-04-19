/**
 * @file: orgUserUtils.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { OrgUserRoleType } from '@euler/model/enum';

export const getOrgUserRoleTypeLabels = (
  role: string | null | undefined,
): string[] => {
  const roles = (role ?? '')
    .split(/\s*,\s*/g)
    .map(x => x.trim())
    .filter(x => x) as OrgUserRoleType[];
  const labels: string[] = [];
  if (roles?.includes(OrgUserRoleType.Administrator)) {
    labels.push('管理员');
  }
  if (roles?.includes(OrgUserRoleType.Manager)) {
    labels.push('门店经理');
  }
  if (roles?.includes(OrgUserRoleType.ServiceAgents)) {
    labels.push('服务顾问');
  }
  if (roles?.includes(OrgUserRoleType.Technicians)) {
    labels.push('维保技师');
  }
  return labels;
};
