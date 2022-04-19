import { FontFamily } from '@euler/components/typography';
import { random } from '@euler/utils';
import { range } from 'ramda';
import { memo } from 'react';
import { StyleProp, Text, TextStyle, ViewStyle } from 'react-native';
import { AdvancedImage } from './adv-image/AdvancedImage';
import { AdvancedImageProps } from './adv-image/AdvancedImage.shared';
import { Center } from './Center';

const DefaultAvatarBgColors = [
  '#00AA55',
  '#009FD4',
  '#B381B3',
  '#939393',
  '#E3BC00',
  '#D47500',
  '#DC2A2A',
  '#d3155a',
  '#8e78ff',
  '#ff7300',
  '#fbb03b',
  '#ed1e78',
  '#009344',
  '#ed1c24',
  '#2e3191',
  '#fc7d7b',
  '#ffcc00',
  '#3aa17d',
  '#4f01bb',
  '#10c9bd',
  '#662d8c',
  '#06a7c4',
  '#0054ae',
];

export const Avatar = memo(
  ({
    style,
    name,
    textStyle,
    ...advancedImageProps
  }: {
    name: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
  } & AdvancedImageProps) => {
    if (advancedImageProps.uri) {
      return <AdvancedImage {...advancedImageProps} style={style} />;
    }

    if (!name) {
      console.warn('Name is empty for avatar, a random value is used');
      const chars = range('a'.charCodeAt(0), 'z'.charCodeAt(0)).map(x =>
        String.fromCharCode(x),
      );
      name = random(chars);
    }

    const codepoint = name.codePointAt(0) ?? name.charCodeAt(0);
    const index = codepoint % DefaultAvatarBgColors.length;
    const bgColor = DefaultAvatarBgColors[index];

    return (
      <Center
        css={`
          background-color: ${bgColor};
        `}
        style={style}
      >
        <Text
          css={`
            font-family: ${FontFamily.NotoSans.Light};
            font-size: 10px;
            color: #fff;
            text-transform: uppercase;
          `}
          style={textStyle}
        >
          {name.charAt(0)}
        </Text>
      </Center>
    );
  },
);
