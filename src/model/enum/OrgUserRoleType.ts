/**
 * @file: OrgUserRoleType.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum OrgUserRoleType {
  Administrator = 'admin',
  Technicians = 'tech',
  ServiceAgents = 'service_agent',
  Manager = 'manager',
  Quoter = 'quoter',
  Financial = 'financial',
}

export const OrgUserRoleTypeValueSet = new Set([
  OrgUserRoleType.Administrator,
  OrgUserRoleType.Technicians,
  OrgUserRoleType.ServiceAgents,
  OrgUserRoleType.Manager,
  OrgUserRoleType.Quoter,
  OrgUserRoleType.Financial,
]);
