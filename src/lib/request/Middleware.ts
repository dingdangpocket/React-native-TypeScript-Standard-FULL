/**
 * @file: Middleware.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { RequestContext, ResponseContext } from './types';

export interface Middleware {
  pre?(context: RequestContext): Promise<void>;
  post?(context: ResponseContext): Promise<void>;
}
