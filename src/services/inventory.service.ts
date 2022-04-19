/**
 * @file: inventory.service.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { HttpClient } from '@euler/lib/request';
import { DeliveryCheckTemplate, InspectionTemplate } from '@euler/model';
import {
  VehicleInspectionSite,
  VehicleInspectionSiteCategory,
} from '@euler/model/entity';
import {
  InspectionTemplatePredefinedType,
  InspectionTemplateSceneType,
  ResourceAccessScope,
} from '@euler/model/enum';

export class InventoryService {
  constructor(private readonly api: HttpClient) {}

  async getVersions(): Promise<{ system: number; org: number; store: number }> {
    return await this.api.get().url('/inventory/versions').future();
  }

  async getCategories(): Promise<VehicleInspectionSiteCategory[]> {
    return await this.api.get().url('/inventory/categories').future();
  }

  async load(): Promise<{
    sites: VehicleInspectionSite[];
    versionInfo: { system: number; org: number; store: number };
  }> {
    return await this.api.get().url('/inventory').future();
  }

  async getSites(
    scope?: ResourceAccessScope,
  ): Promise<VehicleInspectionSite[]> {
    return await this.api.get().url('/inventory/sites', { scope }).future();
  }

  async getTemplates(params: {
    scope?: ResourceAccessScope;
    scene?: InspectionTemplateSceneType;
    type?: InspectionTemplatePredefinedType;
  }): Promise<InspectionTemplate[]> {
    return await this.api.get().url('/inventory/templates', params).future();
  }

  async getTemplateDetail(id: number): Promise<InspectionTemplate> {
    return await this.api
      .get()
      .url('/inventory/templates/:id', { id })
      .future();
  }

  async getDeliveryCheckTemplates(
    scope?: ResourceAccessScope,
  ): Promise<DeliveryCheckTemplate[]> {
    return await this.api
      .get()
      .url('/inventory/delivery-check-templates', {
        scope,
      })
      .future();
  }
}
