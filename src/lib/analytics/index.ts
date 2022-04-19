/**
 * @file: index.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { AnalyticEvents } from '@euler/generated/AnalyticEvents';
import { mixpanel } from '@euler/lib/integration/mixpanel';

export function setupAnalytics() {
  AnalyticEvents.default.addEventListener((event, props) => {
    mixpanel.track(event, props);
  });
}
