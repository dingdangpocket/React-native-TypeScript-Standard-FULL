/**
 * @file: index.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import {
  InspectionTaskEventSubType,
  InspectionTaskEventType,
} from '@euler/model/enum';
import { registerEventType } from '../../registry';

const register = registerEventType(InspectionTaskEventType.DeliveryCheck);

function pendingIssuesConfirmed() {
  register(InspectionTaskEventSubType.PendingIssuesConfirmed)(item => {
    item.label('遗留问题已确认');
  });
}

function checkListReviewed() {
  register(InspectionTaskEventSubType.CheckListReviewed)(item => {
    item.label('完工交车');
  });
}

function itemReviewed() {
  register(InspectionTaskEventSubType.CheckListItemReviewed)((item, data) => {
    item.label(data.name).medias('m');
  });
}

pendingIssuesConfirmed();
checkListReviewed();
itemReviewed();
