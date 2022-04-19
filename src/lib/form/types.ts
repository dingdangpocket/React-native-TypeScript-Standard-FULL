/**
 * @file: types.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { ReactNode } from 'react';
import {
  AccessibilityProps,
  ColorValue,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  ReturnKeyTypeOptions,
  StyleProp,
  TextInputAndroidProps,
  TextInputFocusEventData,
  TextInputIOSProps,
  ViewStyle,
} from 'react-native';

export type FormElementType = 'text' | 'custom' | 'element-group';

export type FormElementLabelPosition = 'top' | 'left';

export type FormData = { [p: string]: any };

export interface FormElement<T extends FormData> {
  key?: string;
  testID?: string;
  label?: ReactNode;
  labelPosition?: FormElementLabelPosition;
  type: FormElementType;
  prop: keyof T;
  helpText?: ReactNode;
  width?: number | string;
  style?: StyleProp<ViewStyle>;
  hidden?: boolean | ((entity: T | Partial<T>, extra: any) => boolean);
  disabled?: boolean | ((entity: T | Partial<T>, extra: any) => boolean);
  onChange?: (
    changes: { [K in keyof T]?: T[K] },
    extra: any,
    ...args: any[]
  ) => void;
}

export type FormTextValueAdapter = {
  toText: (value: any) => string;
  toValue: (text: string) => any;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type FormElementTextProps<T extends FormData> = {
  valueType?: 'number' | 'string';
  adapter?: FormTextValueAdapter;
  behavior?: 'controlled' | 'non-controlled';
  editable?: boolean | (() => boolean);

  // props from TextInputProps
  defaultValue?: string;
  autoCorrect?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  allowFontScaling?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  blurOnSubmit?: boolean;
  caretHidden?: boolean;
  contextMenuHidden?: boolean;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  placeholder?: string;
  placeholderTextColor?: ColorValue;
  returnKeyType?: ReturnKeyTypeOptions;
  secureTextEntry?: boolean;
  selectTextOnFocus?: boolean;
  selection?: { start: number; end?: number | undefined };
  selectionColor?: ColorValue;
  textAlign?: 'left' | 'center' | 'right';
  maxFontSizeMultiplier?: number | null;

  ios?: TextInputIOSProps | (() => TextInputIOSProps);
  android?: TextInputAndroidProps | (() => TextInputAndroidProps);
  accessibility?: AccessibilityProps | (() => AccessibilityProps);
};

export type FormElementText<T extends FormData> = Omit<FormElement<T>, 'type'> &
  FormElementTextProps<T> & {
    type: 'text';
    onFocus?: (
      e: NativeSyntheticEvent<TextInputFocusEventData>,
      extra: any,
    ) => void;

    onBlur?: (
      e: NativeSyntheticEvent<TextInputFocusEventData>,
      extra: any,
    ) => void;
  };

export interface FormElementCustom<T extends FormData> extends FormElement<T> {
  render?: (extra: any) => ReactNode | null | undefined;
}

export interface FormElementGroup<T extends FormData> extends FormElement<T> {
  elements: Array<FormElement<T>>;
}
