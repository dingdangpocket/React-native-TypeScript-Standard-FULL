/**
 * @file: color-mode.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { serviceFactory } from '@euler/services/factory';
import { onErrorIgnore } from '@euler/utils';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Appearance, Platform } from 'react-native';
export type ColorMode = 'light' | 'dark';

export class ColorModeManager {
  static Key = '@euler/settings/color-mode';

  static default = new ColorModeManager();

  constructor(private readonly defaultColorMode: ColorMode = 'light') {}

  async get(): Promise<ColorMode> {
    try {
      return (
        (await serviceFactory.defaultStorageService.get<ColorMode>(
          ColorModeManager.Key,
        )) ?? this.defaultColorMode
      );
    } catch {
      return this.defaultColorMode;
    }
  }

  async set(value: ColorMode) {
    try {
      await serviceFactory.defaultStorageService.set(
        ColorModeManager.Key,
        value,
      );
    } catch (e) {
      console.error(e);
    }
  }
}

export const useColorMode = () => {
  const [colorMode, setColorMode] = useState<ColorMode>();

  useEffect(() => {
    SplashScreen.preventAutoHideAsync()
      .catch(onErrorIgnore)
      .then(async () => {
        const result = await ColorModeManager.default.get();
        return result ?? Appearance.getColorScheme() ?? 'light';
      })
      .then(value => {
        setColorMode(value);
      })
      .catch(onErrorIgnore);

    if (Platform.OS === 'web') return;

    const listener = Appearance.addChangeListener(settings => {
      if (settings.colorScheme && settings.colorScheme !== colorMode) {
        setColorMode(settings.colorScheme);
      }
    });

    return () => listener.remove();
  }, [colorMode]);

  return colorMode;
};
