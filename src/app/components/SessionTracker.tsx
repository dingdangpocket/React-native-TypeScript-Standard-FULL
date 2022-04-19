import { useSessionTracker } from '@euler/functions/sessionTracking';
import { memo } from 'react';

export const SessionTracker = memo(() => {
  useSessionTracker();
  return null;
});
