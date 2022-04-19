import { memo, useCallback } from 'react';
import { StyleProp, TextInput, View, ViewStyle } from 'react-native';
import { useTheme } from 'styled-components';
import { Pencil } from './PencilIcon';

export const ValueInputCell = memo(
  ({
    valueUnit,
    value,
    style,
    onChange,
  }: {
    valueUnit?: string;
    value?: number;
    style?: StyleProp<ViewStyle>;
    onChange?: (value: number | undefined) => void;
  }) => {
    const {
      inspection: {
        siteInspection: {
          valueInput: { bgColor, iconColor, placeholderTextColor },
        },
      },
    } = useTheme();

    const onTextChange = useCallback(
      (text: string) => {
        let v: number | undefined = Number(text.trim());
        if (isNaN(v)) v = undefined;
        if (v === value) return;
        onChange?.(v);
      },
      [onChange, value],
    );

    return (
      <View
        css={`
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          height: 39px;
          border-radius: 5px;
          background-color: ${bgColor};
          padding: 0 12px;
        `}
        style={style}
      >
        <Pencil color={iconColor} />
        <View
          css={`
            width: 1px;
            height: 20px;
            background-color: ${iconColor};
            margin-left: 8px;
          `}
        />
        <TextInput
          placeholder={`手动填写检测结果${valueUnit ? `(${valueUnit})` : ''}`}
          placeholderTextColor={placeholderTextColor}
          value={value != null ? String(value) : ''}
          onChangeText={onTextChange}
          css={`
            height: 100%;
            flex: 1;
            padding: 0 9px;
          `}
        />
      </View>
    );
  },
);
