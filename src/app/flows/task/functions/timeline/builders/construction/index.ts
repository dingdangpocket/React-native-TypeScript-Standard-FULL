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

const register = registerEventType(InspectionTaskEventType.Construction);

function jobCommitted() {
  register(InspectionTaskEventSubType.ConstructionJobCommitted)(
    (item, data) => {
      item.label(data.jn).medias('m');
    },
  );
}

jobCommitted();
