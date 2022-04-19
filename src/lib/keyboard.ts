/**
 * @file: keyboard.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { safeMarkDevFlag } from '@euler/utils';
import { useBehaviorSubjectUpdater } from '@euler/utils/hooks';
import { last } from 'ramda';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import { BehaviorSubject, distinctUntilChanged, map, startWith } from 'rxjs';

const isDebugEnabled = safeMarkDevFlag(true);

export type AutomaticKeyboardToggleRequest = {
  key: string;
  on: boolean;
};

const keyboardToggleRequests$ = new BehaviorSubject<
  AutomaticKeyboardToggleRequest[]
>([]);

export const enableAutomaticKeyboard = () => {
  KeyboardManager.setKeyboardDistanceFromTextField(30);
  KeyboardManager.setEnable(true);
  KeyboardManager.setEnableAutoToolbar(true);
  isDebugEnabled && console.log('IQKeyboardManager enabled');
};

export const disableAutomaticKeyboard = () => {
  KeyboardManager.setEnable(false);
  KeyboardManager.setEnableAutoToolbar(false);
  isDebugEnabled && console.log('IQKeyboardManager disabled');
};

export const useToggleAutomaticKeyboard = (enabled: boolean) => {
  const setKeyboardToggleRequests = useBehaviorSubjectUpdater(
    keyboardToggleRequests$,
  );
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }
    const key = Math.random().toString();
    setKeyboardToggleRequests(p => [...p, { key, on: enabled }]);
    return () => {
      setKeyboardToggleRequests(p => p.filter(req => req.key !== key));
    };
  }, [enabled, setKeyboardToggleRequests]);
};

export const AutomaticKeyboard = ({ toggle }: { toggle: 'on' | 'off' }) => {
  useToggleAutomaticKeyboard(toggle === 'on');
};

export const AutomaticKeyboardMonitor = () => {
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }
    const sub = keyboardToggleRequests$
      .pipe(
        map(requests => last(requests)?.on ?? false),
        startWith(false),
        distinctUntilChanged(),
      )
      .subscribe(enabled => {
        if (enabled) {
          enableAutomaticKeyboard();
        } else {
          disableAutomaticKeyboard();
        }
      });
    return () => {
      sub.unsubscribe();
    };
  }, []);
  return null;
};
