/**
 * @file: mixpenel.native.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

console.log('mixpanel init native');

import { config } from '@euler/config';
import { UserIdentity } from '@euler/model';
import { onErrorIgnore } from '@euler/utils';
import { Mixpanel, People } from 'mixpanel-react-native';
import { sentry } from './sentry.native';

let sdk: Mixpanel | undefined = undefined;

export namespace mixpanel {
  export function setup() {
    sdk = new Mixpanel(config.mixpanel.token);
    sdk.setLoggingEnabled(__DEV__);
    sdk.init().catch(e => {
      sentry.captureException(e);
    });
  }

  export function identify(user: UserIdentity) {
    const { uid, ...props } = user;
    if (!sdk) return;
    sdk.identify(uid);
    sdk
      .getDistinctId()
      .then(distinctId => {
        sdk!.alias(uid, distinctId);
      })
      .catch(onErrorIgnore);
    const mixpanelPeople = sdk.getPeople();
    for (const prop in props) {
      if (Object.prototype.hasOwnProperty.call(props, prop)) {
        mixpanelPeople.set(prop, props[prop]);
      }
    }
  }

  export function reset() {
    sdk?.reset();
  }

  export function people(): People | undefined {
    return sdk?.getPeople();
  }

  export function track(name: string, props?: { [p: string]: any }) {
    sdk?.track(name, props);
  }

  export function flush() {
    sdk?.flush();
  }

  export function registerSuperProperties(props: { [p: string]: any }) {
    sdk?.registerSuperProperties(props);
  }

  export function registerSuperPropertiesOnce(props: { [p: string]: any }) {
    sdk?.registerSuperPropertiesOnce(props);
  }
}
