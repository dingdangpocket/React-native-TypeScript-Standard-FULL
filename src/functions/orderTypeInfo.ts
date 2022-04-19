/**
 * @file: orderTypeInfo.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { InspectionOrderType } from '@euler/model/enum';

type OrderTypeInfo = {
  name: string;
  isDefault?: boolean;
};

export const OrderTypeInfoMap: {
  [p in InspectionOrderType]: OrderTypeInfo;
} = {
  basic: { name: '基础保养' },
  repair: { name: '维修保养' },
  full: { name: '全车保养', isDefault: true },
};

export function getOrderTypeInfo(type: InspectionOrderType) {
  return OrderTypeInfoMap[type];
}

export function getOrderTypes(): Array<
  { type: InspectionOrderType } & OrderTypeInfo
> {
  const keys = Object.keys(OrderTypeInfoMap) as InspectionOrderType[];
  return keys.map(type => ({
    type,
    ...OrderTypeInfoMap[type],
  }));
}
