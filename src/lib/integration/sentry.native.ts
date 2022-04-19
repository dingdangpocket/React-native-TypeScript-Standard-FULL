/**
 * @file: sentry.native.ts
 * @description sentry integration code for native platforms
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { config } from '@euler/config';
import type { UserIdentity } from '@euler/model';
import { NavigationContainerRef } from '@react-navigation/core';
import {
  CaptureConsole,
  ExtraErrorData,
  RewriteFrames,
} from '@sentry/integrations';
import * as Sentry from '@sentry/react-native';
import { ReactNativeTracing } from '@sentry/react-native';
import {
  Breadcrumb,
  CaptureContext,
  Event,
  LogLevel,
  Scope,
} from '@sentry/types';
import { Platform } from 'react-native';
import * as SentryExpo from 'sentry-expo';

export { TouchEventBoundary, withErrorBoundary } from '@sentry/react-native';

const routingInstrumentation = new Sentry.ReactNavigationV5Instrumentation();

export namespace sentry {
  export function identify(user: UserIdentity) {
    const { uid, userName, email, ...extra } = user;
    SentryExpo.Native.setUser({
      id: uid,
      username: userName,
      email,
      ...extra,
    });
  }

  export function reset() {
    SentryExpo.Native.setUser(null);
  }

  export function setup() {
    // see https://docs.sentry.io/platforms/react-native/configuration/options/
    // for more common options that are available
    SentryExpo.init({
      dsn: config.sentry.dsn,
      environment: config.environment,
      enableNative: true,
      sampleRate: 1.0, // this is also the default, just make it more explicit
      tracesSampleRate: config.sentry.tracesSampleRate,
      enableInExpoDevelopment: true,
      debug: false,
      normalizeDepth: 4, // default is 3
      logLevel: LogLevel.Error,
      integrations: [
        new ExtraErrorData(),
        new CaptureConsole({
          levels: ['error'],
        }),
        new ReactNativeTracing({
          tracingOrigins: [config.apiEndpoint.replace(/^https?:\/\//, '')],
          routingInstrumentation,
        }),
        new RewriteFrames({
          iteratee: frame => {
            if (frame.filename) {
              // the values depend on what names you give the bundle files
              // you are uploading to Sentry
              frame.filename =
                Platform.OS === 'android'
                  ? 'app:///index.android.bundle'
                  : 'app:///main.jsbundle';
            }
            return frame;
          },
        }),
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
    routingInstrumentation.registerNavigationContainer(navigator);
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
