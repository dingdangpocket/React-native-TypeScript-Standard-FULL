import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import React, { memo, ReactNode, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

export type BgColorProp =
  | string
  | {
      startColor: string;
      endColor: string;
      direction?: 'horizontal' | 'vertical';
    }
  | LinearGradientProps;

export const Background = memo(
  ({
    bgColor,
    style,
    children,
  }: {
    bgColor: BgColorProp;
    style?: StyleProp<ViewStyle>;
    children?: ReactNode;
  }) => {
    const gradient = useMemo(
      () =>
        typeof bgColor === 'string'
          ? undefined
          : 'startColor' in bgColor
          ? {
              colors: [bgColor.startColor, bgColor.endColor],
              locations: [0, 1],
              start: { x: 0, y: 0 },
              end:
                !bgColor.direction || bgColor.direction === 'horizontal'
                  ? { x: 1, y: 0 }
                  : { x: 0, y: 1 },
            }
          : bgColor,
      [bgColor],
    );

    if (typeof bgColor === 'string') {
      return (
        <View
          css={`
            background-color: ${bgColor};
          `}
          style={style}
        >
          {children}
        </View>
      );
    }

    return (
      <LinearGradient {...gradient!} style={style}>
        {children}
      </LinearGradient>
    );
  },
);
