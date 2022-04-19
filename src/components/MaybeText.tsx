import { memo, ReactNode } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

type MaybeTextStyle<T extends ReactNode> = T extends string | number | boolean
  ? StyleProp<TextStyle>
  : T extends null | undefined
  ? never
  : StyleProp<ViewStyle>;

export const MaybeText = memo(
  <T extends ReactNode>({
    text,
    numberOfLines,
    ...props
  }: {
    text?: T;
    numberOfLines?: number;
    style?: MaybeTextStyle<T>;
  }) => {
    if (!text) return null;

    const {
      fontFamily,
      fontSize,
      color,
      fontStyle,
      fontWeight,
      letterSpacing,
      lineHeight,
      textAlign,
      textDecorationLine,
      textDecorationStyle,
      textDecorationColor,
      textShadowColor,
      textShadowOffset,
      textShadowRadius,
      textTransform,
      ...style
    } = (StyleSheet.flatten(props.style) ?? {}) as TextStyle;
    if (text instanceof Error) {
      text = text.message as any;
    }
    if (
      typeof text === 'string' ||
      typeof text === 'number' ||
      typeof text === 'boolean'
    ) {
      return (
        <Text
          numberOfLines={numberOfLines}
          style={[
            {
              fontFamily,
              fontSize,
              color,
              fontStyle,
              fontWeight,
              letterSpacing,
              lineHeight,
              textAlign,
              textDecorationLine,
              textDecorationStyle,
              textDecorationColor,
              textShadowColor,
              textShadowOffset,
              textShadowRadius,
              textTransform,
            },
            style,
          ]}
        >
          {String(text)}
        </Text>
      );
    }
    return <View style={style}>{text}</View>;
  },
);
