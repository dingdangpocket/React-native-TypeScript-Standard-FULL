/**
 * @file: usePrevious.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useEffect, useRef } from 'react';

export function usePrevious<T>(value: T | undefined) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export const useWatchValue = <T>(
  value: T,
  onChange: (prev: T | undefined, curr: T) => void,
) => {
  const ref = useRef<T>();
  useEffect(() => {
    if (ref.current !== value) {
      onChange(ref.current, value);
      ref.current = value;
    }
  }, [onChange, value]);
};
