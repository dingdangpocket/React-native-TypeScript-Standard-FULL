/**
 * @file: useIsAppActive.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useCreation } from '@euler/utils/hooks/useCreation';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { BehaviorSubject } from 'rxjs';

export const useIsAppActive = () => {
  const [active, setState] = useState(() => AppState.currentState === 'active');
  useEffect(() => {
    const listener = AppState.addEventListener('change', state => {
      setState(state === 'active');
    });
    return () => listener.remove();
  }, [setState]);
  return active;
};

export const useIsAppActive$ = () => {
  const behaviorSubject = useCreation(
    () => new BehaviorSubject(AppState.currentState === 'active'),
    [],
  );
  useEffect(() => {
    const listener = AppState.addEventListener('change', state => {
      behaviorSubject.next(state === 'active');
    });
    return () => listener.remove();
  }, [behaviorSubject]);
  return behaviorSubject;
};
