/**
 * @file: DeliveryCheckTemplateConf.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export interface DeliveryCheckTemplateConf {
  items: DeliveryCheckTemplateItem[];
}

export interface DeliveryCheckTemplateItem {
  id: string;
  subject: string;
  requiresPhoto: boolean;
  options?: DeliveryCheckTemplateItemOption[];
  medias?: any[];
}

export interface DeliveryCheckTemplateItemOption {
  id: string;
  title: string;
  isDefaultChecked: boolean;
  remark?: string | null;
}
