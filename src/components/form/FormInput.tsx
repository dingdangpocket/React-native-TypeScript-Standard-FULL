import { FontFamily } from '@euler/components/typography';
import { memo, useCallback, useRef } from 'react';
import {
  KeyboardTypeOptions,
  Platform,
  ReturnKeyTypeOptions,
  StyleProp,
  TextInput,
  ViewStyle,
} from 'react-native';
import { TVFocusable } from '../tvos/TVFocusable';

export type FormInputProps = {
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  style?: StyleProp<ViewStyle>;
  value?: string;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  returnKeyLabel?: string;
  isPassword?: boolean;
  bgColor?: string;
  autoFocus?: boolean;
  onChange?: (value: string) => void;
};

export const FormInput = memo(
  ({
    bgColor = '#fff',
    placeholder,
    multiline,
    numberOfLines,
    style,
    value,
    keyboardType,
    returnKeyType,
    returnKeyLabel,
    isPassword,
    autoFocus,
    onChange,
  }: FormInputProps) => {
    const ref = useRef<TextInput>(null);
    const onPress = useCallback(() => {
      ref.current?.focus();
    }, []);
    return (
      <TVFocusable
        onPress={onPress}
        color="#ddd"
        tvStyle={{
          height: 44,
          borderRadius: 22,
          backgroundColor: bgColor,
        }}
      >
        <TextInput
          ref={ref}
          placeholder={placeholder}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : undefined}
          keyboardType={keyboardType}
          secureTextEntry={isPassword}
          returnKeyType={returnKeyType}
          returnKeyLabel={returnKeyLabel}
          autoFocus={autoFocus}
          css={`
            padding: 8px 22px;
            border-radius: 22px;
            height: 44px;
            background-color: ${Platform.isTV ? 'transparent' : bgColor};
            font-family: ${FontFamily.NotoSans.Light};
          `}
          style={style}
          value={value ?? ''}
          onChangeText={onChange}
        />
      </TVFocusable>
    );
  },
);
