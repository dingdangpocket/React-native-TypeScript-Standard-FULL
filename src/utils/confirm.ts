/**
 * @file: confirm.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { Alert, Platform } from 'react-native';

let defaultConfirmButtonText = 'Confirm';
let defaultCancelButtonText = 'Cancel';

export const setDefaultConfirmAlertOptions = (options: {
  confirmButtonText: string;
  cancelButtonText: string;
}) => {
  defaultConfirmButtonText = options.confirmButtonText;
  defaultCancelButtonText = options.cancelButtonText;
};

export const withConfirmation = async (options: {
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}) => {
  const {
    title,
    message,
    confirmButtonText = defaultConfirmButtonText,
    cancelButtonText = defaultCancelButtonText,
  } = options;
  return await new Promise<boolean>(resolve => {
    if (Platform.OS === 'web') {
      resolve(window.confirm(`${title}\n${message}`));
      return;
    }
    Alert.alert(title, message, [
      {
        text: confirmButtonText,
        style: 'destructive',
        onPress: () => resolve(true),
      },
      {
        text: cancelButtonText,
        style: 'cancel',
        onPress: () => resolve(false),
      },
    ]);
  });
};
