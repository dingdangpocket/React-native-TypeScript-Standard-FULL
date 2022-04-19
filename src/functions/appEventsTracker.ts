/**
 * @file: trackAppEvents.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { AnalyticEvents } from '@euler/generated/AnalyticEvents';
import { serviceFactory } from '@euler/services/factory';

export namespace appEventsTracker {
  const Metrics = {
    launchCount: 'metrics.app.launch_count',
  };

  export async function appLaunched(extra?: { [p: string]: any }) {
    const prev = await serviceFactory.defaultStorageService.get<number>(
      Metrics.launchCount,
      0,
    );
    const curr = (prev ?? 0) + 1;
    AnalyticEvents.default.appLaunched({ counter: curr }, extra);
    await serviceFactory.defaultStorageService.set(Metrics.launchCount, curr);
  }
}
