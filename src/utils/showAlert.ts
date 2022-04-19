/**
 * @file: showAlert.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { Alert, Platform } from 'react-native';

export async function showAlert(
  title: string,
  message?: string,
  btnText?: string,
): Promise<void> {
  if (Platform.OS === 'web') {
    alert(message ?? title);
  } else {
    // eslint-disable-next-line @typescript-eslint/return-await
    return new Promise<void>(resolve => {
      Alert.alert(title, message, [
        {
          text: btnText ?? 'OK',
          onPress: () => {
            resolve();
          },
        },
      ]);
    });
  }
}
