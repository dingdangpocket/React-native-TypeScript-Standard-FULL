/**
 * @file: mixpanel.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { config } from '@euler/config';
import { UserIdentity } from '@euler/model';
import sdk, { People } from 'mixpanel-browser';

export namespace mixpanel {
  export function setup() {
    sdk.init(config.mixpanel.token, {
      debug: __DEV__,
      secure_cookie: true,
    });
  }

  export function identify(user: UserIdentity) {
    const { uid, ...props } = user;
    sdk.identify(uid);
    sdk.alias(uid, sdk.get_distinct_id());
    sdk.people.set(props);
  }

  export function reset() {
    sdk.reset();
  }

  export function people(): People | undefined {
    return sdk.people;
  }

  export function track(name: string, props?: { [p: string]: any }) {
    sdk.track(name, props);
  }

  export function flush() {
    /* do nothing for browser tracking, flushing is automatic */
  }

  export function registerSuperProperties(props: { [p: string]: any }) {
    sdk.register(props);
  }

  export function registerSuperPropertiesOnce(props: { [p: string]: any }) {
    sdk.register_once(props);
  }
}
