/**
 * @file: setup.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { setupAnalytics } from '@euler/lib/analytics';
import { integrations } from '@euler/lib/integration';

export function setup() {
  integrations.setup();

  setupAnalytics();
}
