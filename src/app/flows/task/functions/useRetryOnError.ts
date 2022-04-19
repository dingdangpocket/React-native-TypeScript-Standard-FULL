/**
 * @file: useRetryOnError.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useObservableSuspenseContext } from '@euler/utils/hooks';
import { nanoid } from 'nanoid/non-secure';
import { useCallback, useState } from 'react';

export type RetryableErrorContext = {
  errorBoundaryKey: string | undefined;
  retryOnError: () => void;
};

export const useRetryOnError = (resourceId: string): RetryableErrorContext => {
  const resourceHolder = useObservableSuspenseContext();
  const [errorBoundaryKey, setErrorBoundaryKey] = useState<string>();
  const retryOnError = useCallback(() => {
    if (!resourceId) return;
    resourceHolder.remove(resourceId);
    setErrorBoundaryKey(nanoid());
  }, [resourceHolder, resourceId]);
  return { errorBoundaryKey, retryOnError };
};
