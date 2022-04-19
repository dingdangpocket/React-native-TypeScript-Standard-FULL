/**
 * @file: DeliveryCheckWorkItem.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export interface DeliveryCheckWorkItemMedia {
  id: number;
  type: string;
  url: string;
  coverUrl: string;
  title: string;
  subTitle: string;
  remark: string;
}

export interface DeliveryCheckWorkItem {
  title: string;
  constructionJobId?: number;
  checked: boolean;
  technicianId?: number;
  technicianName?: string;
  medias?: DeliveryCheckWorkItemMedia[];
  remark?: string;
  checkedAt?: string | Date;
}
