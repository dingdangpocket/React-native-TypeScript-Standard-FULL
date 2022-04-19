/**
 * @file: sentry.ts
 * @description sentry integration code for web
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { config } from '@euler/config';
import type { UserIdentity } from '@euler/model';
import { NavigationContainerRef } from '@react-navigation/core';
import { CaptureConsole, ExtraErrorData } from '@sentry/integrations';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import {
  Breadcrumb,
  CaptureContext,
  Event,
  LogLevel,
  Scope,
} from '@sentry/types';
import { Fragment } from 'react';
import { Platform } from 'react-native';
import { getSentryRelease } from './sentry.shared';

const debug = require('debug')('integration:sentry');

export const { withErrorBoundary } = Sentry;
export const TouchEventBoundary = Fragment;

export namespace sentry {
  export function identify(user: UserIdentity) {
    const { uid, userName, email, ...extra } = user;
    Sentry.setUser({
      id: uid,
      username: userName,
      email,
      ...extra,
    });
  }

  export function reset() {
    Sentry.setUser(null);
  }

  export function setup() {
    // see https://docs.sentry.io/platforms/react-native/configuration/options/
    // for more common options that are available
    Sentry.init({
      dsn: config.sentry.dsn,
      environment: config.environment,
      release: getSentryRelease(),
      sampleRate: 1.0, // this is also the default, just make it more explicit
      tracesSampleRate: config.sentry.tracesSampleRate,
      debug: false,
      normalizeDepth: 4, // default is 3
      logLevel: LogLevel.Error,
      integrations: [
        new ExtraErrorData(),
        new Integrations.BrowserTracing(),
        new CaptureConsole({ levels: ['warn', 'error'] }),
      ],
      beforeSend: (event, _hint) => {
        // can change the event fingerprint here as documented below:
        // https://docs.sentry.io/platforms/react-native/usage/sdk-fingerprinting/
        return event;
      },
    });
    Sentry.setTag('os', Platform.OS);
  }

  export function registerRoutingInstrumentation(
    navigator: NavigationContainerRef<any>,
  ) {
    debug('register sentry routing instrumentation: ', navigator);
  }

  export function addBreadcrumb(breadcrumb: Breadcrumb) {
    Sentry.addBreadcrumb(breadcrumb);
  }

  export function configureScope(callback: (scope: Scope) => void) {
    Sentry.configureScope(callback);
  }

  export function withScope(callback: (scope: Scope) => void) {
    Sentry.withScope(callback);
  }

  export function captureException(exception: any, context?: CaptureContext) {
    Sentry.captureException(exception, context);
  }

  export function captureMessage(message: string, context?: CaptureContext) {
    Sentry.captureMessage(message, context);
  }

  export function captureEvent(event: Event): string {
    return Sentry.captureEvent(event);
  }
}
