import { FontFamily } from '@euler/components/typography';
import { memo } from 'react';
import { Text, View } from 'react-native';

export const DefectiveLabel = memo(
  ({ color, text }: { color: string; text: string }) => {
    return (
      <View
        css={`
          background-color: ${color};
          height: 16px;
          border-radius: 8px;
          align-items: center;
          justify-content: center;
          width: 38px;
        `}
      >
        <Text
          css={`
            font-family: ${FontFamily.NotoSans.Light};
            font-size: 10px;
            line-height: 16px;
            text-align: center;
            color: #fff;
          `}
        >
          {text}
        </Text>
      </View>
    );
  },
);
