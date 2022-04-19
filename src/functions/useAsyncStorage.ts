/**
 * @file: useAsyncStorage.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { config } from '@euler/config';
import { useAsyncResource, useBehaviorSubject } from '@euler/utils/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BehaviorSubject, concatMap, from } from 'rxjs';

const cache: Partial<{
  [key: string]: BehaviorSubject<any>;
}> = {};

export function asyncStorageSubjectForKey$<T>(
  key: string,
): BehaviorSubject<T | undefined | null> {
  if (key in cache) {
    return cache[key] as any;
  }

  const subject = new BehaviorSubject<T | undefined | null>(undefined);
  cache[key] = subject;

  const storageKey = `${config.linking.scheme}.${key}`;
  AsyncStorage.getItem(storageKey).then(
    value => {
      if (value != null) {
        subject.next(JSON.parse(value));
      } else {
        subject.next(null);
      }
      void subject
        .pipe(
          concatMap(newValue =>
            from(
              newValue == null
                ? AsyncStorage.removeItem(storageKey)
                : AsyncStorage.setItem(storageKey, JSON.stringify(newValue)),
            ),
          ),
        )
        .subscribe();
    },
    e => {
      alert((e as Error).message);
    },
  );
  return subject;
}

export const useAsyncStorage = <T>(key: string) => {
  const subject$ = asyncStorageSubjectForKey$<T>(key);
  return useBehaviorSubject(subject$);
};

export const getAsyncStorageValue = async <T>(key: string) => {
  try {
    const data = await AsyncStorage.getItem(key);
    if (data != null) {
      return JSON.parse(data) as T;
    }
  } catch (e) {}
  return undefined;
};

export const useAsyncStorageValue = <T>(key: string): T | undefined => {
  return useAsyncResource(
    () => getAsyncStorageValue<T>(key),
    `async-storage-value:${key}`,
  );
};
