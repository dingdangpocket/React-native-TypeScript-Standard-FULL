import { FontFamily } from '@euler/components/typography/fonts';
import { memo } from 'react';
import { StyleProp, Text, ViewStyle } from 'react-native';

export const Heading = memo(
  ({ text, style }: { text: string; style?: StyleProp<ViewStyle> }) => {
    return (
      <Text
        css={`
          font-family: ${FontFamily.NotoSans.Medium};
          font-size: 18px;
          margin-bottom: 16px;
        `}
        style={style}
      >
        {text}
      </Text>
    );
  },
);
