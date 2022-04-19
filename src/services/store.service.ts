/**
 * @file: store.service.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { HttpClient } from '@euler/lib/request';
import {
  OrgGroup,
  OrgMember,
  OrgTeam,
  StoreGatewayDevice,
} from '@euler/model/entity';
import { OrgUserRoleType } from '@euler/model/enum';
import { getCommonRequestParametersAsSearchQuery } from '@euler/services/utils';

export class StoreService {
  constructor(private readonly api: HttpClient) {}

  async listServiceAgents(): Promise<OrgMember[]> {
    return await this.api.get().url('/store/service-agents').future();
  }

  async listGatewayDevices(): Promise<StoreGatewayDevice[]> {
    return await this.api.get().url('/store/gateway-devices').future();
  }

  async registerGatewayDevice(deviceInfo: {
    macAddr: string;
    name?: string | null;
  }): Promise<StoreGatewayDevice> {
    return await this.api
      .post()
      .url('/store/gateway-devices')
      .data(deviceInfo)
      .future();
  }

  async updateGatewayDeviceName(
    macAddr: string,
    name: string,
  ): Promise<StoreGatewayDevice> {
    return await this.api
      .put()
      .url('/store/gateway-devices/:macAddr', { macAddr })
      .data({ name })
      .future();
  }

  async removeGatewayDevice(macAddr: string): Promise<void> {
    await this.api
      .delete()
      .url('/store/gateway-devices/:macAddr', { macAddr })
      .future();
  }

  async getInviteLink(): Promise<string> {
    return await this.api.get().url('/store/invite-link').future();
  }

  async getInviteLinkQrcodeImageUrl(options?: {
    logo?: boolean;
    size?: number;
    expiresIn?: number;
  }): Promise<string> {
    const commonSearchQuery = await getCommonRequestParametersAsSearchQuery();
    return this.api.url('/store/invite-link/qrcode.png', {
      ...options,
      ...commonSearchQuery,
    });
  }

  async listGroups(): Promise<OrgGroup[]> {
    return await this.api.get().url('/groups').future();
  }

  async getGroup(id: number): Promise<OrgGroup> {
    return await this.api.get().url('/groups/:id', { id }).future();
  }

  async listGroupTeams(groupId: number): Promise<OrgTeam[]> {
    return await this.api
      .get()
      .url('/groups/:id/teams', { id: groupId })
      .future();
  }

  async listTeams(): Promise<OrgTeam[]> {
    return await this.api.get().url('/teams').future();
  }

  async getTeam(id: number): Promise<OrgTeam> {
    return await this.api.get().url('/teams/:id', { id }).future();
  }

  async getTeamMembers(
    teamId: number,
    options?: {
      role?: OrgUserRoleType;
      refresh?: boolean;
    },
  ): Promise<OrgMember[]> {
    return await this.api
      .get()
      .url('/teams/:id/members', { id: teamId, ...options })
      .future();
  }

  async listMembers(criterion?: {
    groupId?: number;
    teamId?: number;
    role?: OrgUserRoleType;
    refresh?: boolean;
  }): Promise<OrgMember[]> {
    return await this.api
      .get()
      .url('/members', { ...criterion })
      .future();
  }

  async getMember(id: number): Promise<OrgMember> {
    return await this.api.get().url('/members/:id', { id }).future();
  }
}
