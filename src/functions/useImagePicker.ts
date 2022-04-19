/**
 * @file: useImagePicker.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import * as ImagePicker from 'expo-image-picker';
import { ImagePickerOptions } from 'expo-image-picker';
import { useCallback } from 'react';
import { Platform } from 'react-native';

export const usePickMediaAsset = (options?: ImagePickerOptions) => {
  return useCallback(async () => {
    if (Platform.OS === 'android') {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error(
          'Sorry, permissions are required to access media library',
        );
      }
    }
    return await ImagePicker.launchImageLibraryAsync(options);
  }, [options]);
};
