/**
 * @file: useBehaviorSubject.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export function useBehaviorSubject<T>(
  subject: BehaviorSubject<T>,
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(subject.getValue());
  useEffect(() => {
    const subscription = subject.pipe(distinctUntilChanged()).subscribe({
      next: setState,
    });
    return () => subscription.unsubscribe();
  }, [subject]);
  const update = useBehaviorSubjectUpdater(subject);
  return [state, update];
}

export function useBehaviorSubjectUpdater<T>(
  subject: BehaviorSubject<T>,
): Dispatch<SetStateAction<T>> {
  return useCallback(
    value => {
      if (typeof value === 'function') {
        const current = subject.getValue();
        const next = (value as (p: T) => T)(current);
        if (current !== next) {
          subject.next(next);
        }
      } else {
        subject.next(value);
      }
    },
    [subject],
  );
}
