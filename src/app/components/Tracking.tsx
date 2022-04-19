import { appEventsTracker, kIdentity } from '@euler/functions';
import { integrations } from '@euler/lib/integration';
import { mixpanel } from '@euler/lib/integration/mixpanel';
import { sentry } from '@euler/lib/integration/sentry';
import { UserIdentity } from '@euler/model';
import { serviceFactory } from '@euler/services/factory';
import { onErrorIgnore, onErrorReturn } from '@euler/utils';
import { memo, useEffect } from 'react';

export const Tracking = memo(() => {
  useEffect(() => {
    serviceFactory.defaultStorageService
      .get<UserIdentity>(kIdentity)
      .catch(onErrorReturn(null))
      .then(identity => {
        if (identity) {
          integrations.identifyUser(identity);
          mixpanel.people()?.increment('app_launched');
        }
        setTimeout(() => {
          appEventsTracker
            .appLaunched({
              uid: identity?.uid ?? '',
              username: identity?.userName ?? '',
            })
            .then(() => {
              setTimeout(() => {
                mixpanel.flush();
              }, 1000);
            })
            .catch(error => {
              sentry.captureException(error);
            });
        }, 10);
      })
      .catch(onErrorIgnore);
  }, []);
  return null;
});
