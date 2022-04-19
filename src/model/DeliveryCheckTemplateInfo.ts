/**
 * @file: DeliveryCheckTemplateInfo.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { DeliveryCheckTemplateConf } from '@euler/model/DeliveryCheckTemplateConf';

export interface DeliveryCheckTemplate {
  item: any;
  id: number;
  orgId?: number | null;
  storeId?: number | null;
  name: string;
  isSystemDefault: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  description?: string | null;
  conf?: DeliveryCheckTemplateConf | null;
}
