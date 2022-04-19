/**
 * @file: index.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { UserIdentity } from '@euler/model';
import { logbox } from './logbox';
import { mixpanel } from './mixpanel';
import { sentry } from './sentry';

export namespace integrations {
  export function setup() {
    logbox.ignorePatterns();
    mixpanel.setup();
    sentry.setup();
  }

  export function notifyScreenChange(from: string, to: string, props: any) {
    const params = { from, to, params: JSON.stringify(props, null, 2) };
    mixpanel.track('Page View', params);
    sentry.addBreadcrumb({
      type: 'navigation',
      category: 'navigation',
      data: params,
    });
  }

  export function identifyUser(identity: UserIdentity) {
    sentry.identify(identity);
    mixpanel.identify(identity);
  }

  export function resetUser() {
    sentry.reset();
    mixpanel.reset();
  }
}
