import { maybeFactoryValue } from '@euler/utils';
import { usePersistFn } from '@euler/utils/hooks';
import { memo, useCallback, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  Platform,
  TextInputEndEditingEventData,
  TextInputFocusEventData,
} from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { FormData, FormElementTextProps } from '../types';

const FormInputContainer = styled.View<{
  focused?: boolean;
}>`
  border-color: ${p =>
    p.focused
      ? p.theme.form.input.borderColorFocused
      : p.theme.form.input.borderColor};
  border-width: 1px;
  border-radius: 8px;
`;

const FormInputControl = styled.TextInput<{
  focused?: boolean;
}>``;

export type FormTextInputProps<T extends FormData> = FormElementTextProps<T> & {
  prop: keyof T;
  value: any | undefined;
  onChange: (values: Partial<T>) => void;
};

export const FormTextInput = memo(
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  <T extends FormData>({
    prop,
    behavior,
    editable,
    adapter,
    valueType,
    onChange,
    ios,
    android,
    accessibility,
    placeholderTextColor,
    value,
    ...textInputProps
  }: FormTextInputProps<T>) => {
    const theme = useTheme();
    const [focused, setFocused] = useState(false);
    const interacted = useRef(false);

    const iosProps = typeof ios === 'function' ? ios() : ios;
    const androidProps = typeof android === 'function' ? android() : android;
    const accessibilityProps =
      typeof accessibility === 'function' ? accessibility() : accessibility;

    const valueToText = usePersistFn((v: any) => {
      if (v == null) return '';
      if (adapter?.toText) {
        return adapter.toText(v);
      }
      return String(v);
    });

    const textToValue = usePersistFn((text: string) => {
      if (adapter?.toValue) {
        return adapter.toValue(text);
      }
      if (valueType === 'number') {
        const v = Number(text.trim());
        if (isNaN(v)) return undefined;
        return v;
      }
      return text;
    });

    const handleTextChange = usePersistFn((text: string) => {
      const v = textToValue(text);
      const changes: { [K in keyof T]?: T[K] } = {};
      changes[prop] = v;
      onChange(changes);
    });

    const onFocus = useCallback(() => {
      setFocused(true);
      interacted.current = true;
    }, []);

    const onBlur = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setFocused(false);
        if (behavior === 'controlled' || Platform.OS !== 'web') return;
        const text = e.nativeEvent.text;
        handleTextChange(text);
      },
      [behavior, handleTextChange],
    );

    const onEndEditing = useCallback(
      (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
        if (behavior === 'controlled' || Platform.OS === 'web') return;
        const text = e.nativeEvent.text;
        handleTextChange(text);
      },
      [behavior, handleTextChange],
    );

    const onChangeText = useCallback(
      (text: string) => {
        handleTextChange(text);
      },
      [handleTextChange],
    );

    return (
      <FormInputContainer focused={focused}>
        <FormInputControl
          {...textInputProps}
          {...iosProps}
          {...androidProps}
          {...(accessibilityProps as any)}
          editable={maybeFactoryValue(editable)}
          placeholderTextColor={
            placeholderTextColor ?? theme.form.input.placeholderColor
          }
          value={valueToText(value)}
          focused={focused}
          onFocus={onFocus}
          onBlur={onBlur}
          onChangeText={behavior === 'controlled' ? onChangeText : undefined}
          onEndEditing={onEndEditing}
        />
      </FormInputContainer>
    );
  },
);
