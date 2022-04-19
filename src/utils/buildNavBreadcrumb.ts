/**
 * @file: buildNavBreadcrumb.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { Breadcrumb } from '@sentry/types';

export function buildNavBreadcrumb({
  params,
  from,
  to,
  navigator,
}: {
  from: string;
  to: string;
  params: any;
  navigator: string;
}): Breadcrumb {
  return {
    type: 'navigation',
    category: 'navigation',
    data: {
      from,
      to,
      params: JSON.stringify(params, null, 2),
      navigator,
    },
  };
}
