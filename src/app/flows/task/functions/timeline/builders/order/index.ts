/**
 * @file: index.ts
 * @author: eric <eric.blueplus@gmail.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import {
  InspectionTaskEventSubType,
  InspectionTaskEventType,
} from '@euler/model/enum';
import { registerEventType } from '../../registry';

const register = registerEventType(InspectionTaskEventType.Creation);

function licensePlateNoCaptured() {
  register(InspectionTaskEventSubType.LicensePlateNoCaptured)((item, data) => {
    item.label(`车牌: ${data[0]}`);
  });
}

function vinCaptured() {
  register(InspectionTaskEventSubType.VinCaptured)((item, data) => {
    item.label(`VIN: ${data[0]}`);
  });
}

function orderCreated() {
  register(InspectionTaskEventSubType.OrderCreated)((item, data) => {
    item.label(`订单号: ${data[0]}`);
    if (data[1]) {
      item.tagline(`服务顾问: ${data[1]}`);
    }
  });
}

licensePlateNoCaptured();
vinCaptured();
orderCreated();
