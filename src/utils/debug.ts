/**
 * @file: debug.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { format } from 'date-fns';
import debug from 'debug';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const debugSet = new Set<string>();

export function makeDebug(name: string, enabled = __DEV__) {
  debugSet.add(name);
  debug.enable([...debugSet].join(','));

  const fn = debug(name);

  return (s: string | unknown, ...args: any[]) => {
    if (!enabled) return;
    for (let i = 0; i < args.length; i++) {
      if (typeof args[i] === 'function') {
        args[i] = args[i]();
      }
    }
    const device = Platform.OS === 'web' ? '' : `[${debugDeviceName()}]`;
    fn(`${device}[${debugFormatTime(Date.now(), 'none')}] ${s}`, ...args);
  };
}

export function debugDeviceName() {
  return Platform.OS === 'web'
    ? 'browser'
    : Device.modelName ?? Device.manufacturer;
}

export function debugFormatTime(
  value: Date | number | undefined,
  suffix: 'ms' | 's' | 'none' = 's',
) {
  if (!value) return '(nil)';
  const s = format(value, 'HH:mm:ss.SSS');
  if (suffix === 'ms') return `${s} (${+new Date(value)})`;
  if (suffix === 's') return `${s} (${new Date(value).getTime() / 1000})`;
  return s;
}
