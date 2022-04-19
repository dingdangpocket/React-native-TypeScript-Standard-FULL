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

const register = registerEventType(InspectionTaskEventType.Quotation);

function quotationInitiated() {
  register(InspectionTaskEventSubType.QuotationInitiated)(item => {
    item.label('填写报价单完成');
  });
}

function quotationSubmitted() {
  register(InspectionTaskEventSubType.QuotationSubmitted)(item => {
    item.label('报价已提交至前台');
  });
}

function quotationConfirmed() {
  register(InspectionTaskEventSubType.QuotationConfirmed)(item => {
    item.label('报价已确认');
  });
}

function quotationFinished() {
  register(InspectionTaskEventSubType.QuotationFinished)(item => {
    item.label('报价完成');
  });
}

quotationInitiated();
quotationSubmitted();
quotationConfirmed();
quotationFinished();
