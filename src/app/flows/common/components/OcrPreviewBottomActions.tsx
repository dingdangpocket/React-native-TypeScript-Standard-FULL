import { StatusColors } from '@euler/components';
import { FontFamily } from '@euler/components/typography';
import { useNavigation } from '@react-navigation/native';
import { memo, useEffect } from 'react';
import { StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components';

const kHeight = 44;

const ActionButton = memo(
  ({
    text,
    style,
    onPress,
  }: {
    text: string;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
  }) => {
    const theme = useTheme();
    return (
      <TouchableOpacity
        css={`
          height: ${kHeight}px;
          border-radius: ${kHeight / 2}px;
          padding: 0 ${kHeight / 2}px;
          background-color: ${theme.link};
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          elevation: 3;
        `}
        style={style}
        onPress={onPress}
      >
        <Text
          css={`
            font-family: ${FontFamily.NotoSans.Medium};
            font-size: 16px;
            line-height: ${kHeight}px;
            color: #fff;
          `}
        >
          {text}
        </Text>
      </TouchableOpacity>
    );
  },
);

export const OcrPreviewBottomActions = memo(
  ({ visible, onConfirm }: { visible: boolean; onConfirm?: () => void }) => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const opacity = useSharedValue(visible ? 1 : 0);
    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [
        {
          translateY: interpolate(opacity.value, [0, 1], [80, 0]),
        },
      ],
    }));

    useEffect(() => {
      const value = visible ? 1 : 0;
      if (opacity.value !== value) {
        opacity.value = withTiming(value, { duration: 200 });
      }
    }, [opacity, visible]);

    return (
      <Animated.View
        css={`
          flex-direction: row;
          align-items: center;
          justify-content: center;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          margin-bottom: ${insets.bottom}px;
          height: ${kHeight + 10}px;
          padding: 0 15px;
        `}
        style={animatedStyle}
      >
        <ActionButton
          onPress={() => navigation.goBack()}
          text="重新识别"
          css={`
            background-color: ${StatusColors.Danger};
          `}
        />
        <ActionButton
          onPress={onConfirm}
          text="确认信息"
          css={`
            margin-left: 32px;
          `}
        />
      </Animated.View>
    );
  },
);
