import { Center } from '@euler/components';
import { memo, useCallback } from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import {
  AnnotationTagColorStyle,
  DefaultTagColorPresets,
  TagColorPaletteKey,
  TagColorPresets,
} from '../functions/tagPresets';

const kMaxSize = 30;
const kDefaultSize = 26;
const kBorderWidth = 3;
const kMinSize = kDefaultSize - kBorderWidth * 2;

const Cell = memo(
  ({
    color,
    selected,
    palette,
    style,
    onPress,
  }: {
    palette: TagColorPaletteKey;
    color: string;
    selected?: boolean;
    style?: StyleProp<ViewStyle>;
    onPress: (palette: TagColorPaletteKey) => void;
  }) => {
    const onCellPress = useCallback(() => {
      onPress(palette);
    }, [palette, onPress]);
    const size = selected ? kMaxSize : kDefaultSize;
    return (
      <TouchableOpacity
        onPress={onCellPress}
        css={`
          width: ${kMaxSize}px;
          height: ${kMaxSize}px;
          align-items: center;
          justify-content: center;
          margin-left: 8px;
          margin-right: 8px;
        `}
        style={style}
      >
        <Center
          css={`
            width: ${size}px;
            height: ${size}px;
            border-radius: ${size / 2}px;
            background-color: #fff;
            align-items: center;
            justify-content: center;
          `}
        >
          <View
            css={`
              width: ${kMinSize}px;
              height: ${kMinSize}px;
              border-radius: ${kMinSize / 2}px;
              background-color: ${color};
            `}
          />
        </Center>
      </TouchableOpacity>
    );
  },
);

export const TagColorPicker = memo(
  ({
    colors = DefaultTagColorPresets,
    selectedColor,
    style,
    onChange,
  }: {
    selectedColor?: string;
    style?: StyleProp<ViewStyle>;
    colors?: TagColorPresets;
    onChange?: (colorStyle: AnnotationTagColorStyle) => void;
  }) => {
    const onCellPress = useCallback(
      (key: TagColorPaletteKey) => {
        const colorStyle = colors[key];
        if (colorStyle.fill !== selectedColor?.toUpperCase()) {
          onChange?.(colorStyle);
        }
      },
      [colors, onChange, selectedColor],
    );

    return (
      <View
        css={`
          flex-direction: row;
          align-items: center;
          justify-content: center;
        `}
        style={style}
      >
        {Object.entries(colors).map(([palette, value]) => (
          <Cell
            key={palette}
            palette={palette as TagColorPaletteKey}
            color={value.fill}
            selected={selectedColor?.toUpperCase() === value.fill}
            onPress={onCellPress}
          />
        ))}
      </View>
    );
  },
);
