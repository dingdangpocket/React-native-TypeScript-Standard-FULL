/**
 * @file: types.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { ReactElement, ReactNode } from 'react';

export type LoadingType = 'loading' | 'success' | 'error';

export type LoadingProps = {
  message?: ReactNode;
  type?: LoadingType;
  icon?: ReactElement;
  duration?: number;
  backdrop?: boolean;
  cancelable?: boolean;
};
