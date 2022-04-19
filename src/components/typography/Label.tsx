import { FontFamily } from '@euler/components/typography/fonts';
import { FC, memo } from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from 'styled-components';
import { DefaultTheme } from 'styled-components/native';

const defaultColor = (theme: DefaultTheme) => theme.label.color;

type FontFamilyType =
  | 'thin'
  | 'light'
  | 'regular'
  | 'medium'
  | 'bold'
  | 'black';

type DistribuiveMap<T extends string> = T extends unknown
  ? {
      [p in T]?: true;
    }
  : never;

type FontFamilyShortcut = DistribuiveMap<FontFamilyType>;

const FontFamilyMap: { [p in FontFamilyType]: string } = {
  thin: FontFamily.NotoSans.Thin,
  light: FontFamily.NotoSans.Light,
  regular: FontFamily.NotoSans.Regular,
  medium: FontFamily.NotoSans.Medium,
  bold: FontFamily.NotoSans.Bold,
  black: FontFamily.NotoSans.Black,
};

export const Label: FC<
  {
    family?: FontFamilyType;
    size?: number;
    color?: string | ((theme: DefaultTheme) => string);
    style?: StyleProp<TextStyle>;
    numberOfLines?: number;
    lineHeight?: number;
    ellipsizeMode?: TextProps['ellipsizeMode'];
  } & FontFamilyShortcut
> = memo(
  ({
    family,
    size = 16,
    color = defaultColor,
    children,
    style,
    lineHeight,
    numberOfLines,
    ellipsizeMode,
    ...props
  }) => {
    const theme = useTheme();
    const fontFamily =
      FontFamilyMap[
        (family ?? Object.keys(props)[0] ?? 'regular') as FontFamilyType
      ];
    return (
      <Text
        css={`
          font-family: ${fontFamily};
          font-size: ${size}px;
          line-height: ${lineHeight ?? Math.floor(size * 1.6)}px;
          color: ${typeof color === 'function'
            ? color(theme)
            : color ?? '#000'};
        `}
        style={style}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
      >
        {children}
      </Text>
    );
  },
);
