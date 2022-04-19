/**
 * @file: useSharedValueFrom.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { DependencyList, useEffect } from 'react';
import Animated, { useSharedValue } from 'react-native-reanimated';

export function useSharedValueFrom<T>(
  value: T,
  onChange?: (current: T, previous: T | null) => void,
  deps: DependencyList = [],
): [Animated.SharedValue<T>, Animated.SharedValue<T | null>] {
  const sharedValue = useSharedValue(value);
  const previousValue = useSharedValue<T | null>(null);

  useEffect(() => {
    const p = previousValue.value;
    const previous = sharedValue.value;
    previousValue.value = previous;
    sharedValue.value = value;
    if (p !== null && previous !== value) {
      onChange?.(value, previous);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedValue, previousValue, value, onChange, ...deps]);

  if (previousValue.value === null) {
    onChange?.(value, null);
  }

  return [sharedValue, previousValue];
}
