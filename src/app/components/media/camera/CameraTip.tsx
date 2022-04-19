import { FontFamily } from '@euler/components/typography/fonts';
import { memo } from 'react';
import { StyleProp, Text, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

export const CameraTip = memo(
  ({ style, text }: { style?: StyleProp<ViewStyle>; text?: string }) => {
    return (
      <Animated.View
        pointerEvents="none"
        css={`
          align-items: center;
          margin-bottom: 15px;
        `}
        style={style}
      >
        <Text
          css={`
            font-family: ${FontFamily.NotoSans.Light};
            font-size: 12px;
            color: #fff;
          `}
        >
          {text ?? '可点击拍照或长按进行录像'}
        </Text>
      </Animated.View>
    );
  },
);
