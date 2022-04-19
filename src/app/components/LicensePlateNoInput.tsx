import { Center } from '@euler/components';
import { FontFamily } from '@euler/components/typography';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { Text, TouchableOpacity, View, ViewProps } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type BoxConfig = {
  borderColor: string;
  borderColorSelected: string;
  backgroundColor: string;
  size: number;
};

export const kDefaultBoxConfig: BoxConfig = {
  borderColor: 'transparent',
  borderColorSelected: '#207FE7',
  backgroundColor: '#fff',
  size: 40,
};

const Box = memo(
  ({
    index,
    char,
    selected,
    style,
    config = kDefaultBoxConfig,
    onPress,
    ...props
  }: {
    index: number;
    char?: string;
    selected?: boolean;
    config?: BoxConfig;
    onPress?: (index: number) => void;
  } & Omit<ViewProps, 'onPress'>) => {
    const onInternalPress = useCallback(() => {
      onPress?.(index);
    }, [index, onPress]);
    const selectedValue = useSharedValue(0);
    const borderColor = useDerivedValue(() =>
      interpolateColor(
        selectedValue.value,
        [0, 1],
        [config.borderColor, config.borderColorSelected],
      ),
    );
    const animatedStyle = useAnimatedStyle(() => ({
      borderColor: borderColor.value,
    }));
    useEffect(() => {
      selectedValue.value = withTiming(selected ? 1 : 0, { duration: 250 });
    }, [selectedValue, selected]);
    return (
      <TouchableOpacity
        onPress={onInternalPress}
        css={`
          width: ${config.size}px;
          height: ${config.size}px;
          margin: 1px 2px;
        `}
        style={style}
        {...props}
      >
        <Animated.View
          collapsable={false}
          css={`
            width: ${config.size}px;
            height: ${config.size}px;
            border-radius: 3px;
            background-color: ${config.backgroundColor};
            border-width: 2px;
            border-color: transparent;
            align-items: center;
            justify-content: center;
          `}
          style={animatedStyle}
        >
          <Text
            css={`
              font-family: ${FontFamily.NotoSans.Bold};
              font-size: 16px;
              line-height: 20px;
              color: #111;
            `}
          >
            {char ?? ''}
          </Text>
          {index === 7 && (
            <Center
              css={`
                position: absolute;
                left: -10px;
                right: -10px;
                bottom: ${config.size + 2}px;
              `}
            >
              <Text
                css={`
                  font-family: ${FontFamily.NotoSans.Regular};
                  font-size: 10px;
                  line-height: 12px;
                  color: #40c779;
                `}
              >
                新能源
              </Text>
            </Center>
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  },
);

export const LicensePlateNoInput = memo(
  ({
    value,
    style,
    selectedIndex,
    boxConfig,
    onSelectedIndexChange,
    ...props
  }: {
    value?: string;
    selectedIndex: number;
    boxConfig?: BoxConfig;
    onSelectedIndexChange?: (index: number) => void;
  } & ViewProps) => {
    const chars = useMemo(() => {
      return (value ?? '').padEnd(8).split('');
    }, [value]);
    const onSelected = useCallback(
      (index: number) => {
        onSelectedIndexChange?.(index);
      },
      [onSelectedIndexChange],
    );
    return (
      <View
        css={`
          flex-direction: row;
          align-items: center;
          justify-content: center;
        `}
        style={style}
        {...props}
      >
        {chars.map((char, index) => (
          <Box
            key={index}
            char={char}
            index={index}
            selected={index === selectedIndex}
            onPress={onSelected}
            config={boxConfig}
          />
        ))}
      </View>
    );
  },
);
