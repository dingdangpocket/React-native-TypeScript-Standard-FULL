import { FontFamily } from '@euler/components/typography';
import { SafeHaptics } from '@euler/utils';
import { useSharedValueFrom } from '@euler/utils/hooks';
import { memo, useCallback, useMemo } from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';

export type SegmentControlProps = {
  selectedIndex: number;
  segments: string[];
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  activeTextStyle?: StyleProp<TextStyle>;
  onSelectedIndexChange?: (index: number) => void;
};

export const SegmentControl = memo((props: SegmentControlProps) => {
  const {
    selectedIndex,
    segments,
    style,
    textStyle,
    activeTextStyle,
    onSelectedIndexChange,
  } = props;
  const translateX = useSharedValue(0);
  const [count] = useSharedValueFrom(segments.length);
  const width = useSharedValue(0);
  const borderWidth = useMemo(
    () => StyleSheet.flatten(style).borderWidth ?? 0,
    [style],
  );
  const sliderWidth = useDerivedValue(() => {
    return width.value ? (width.value - 4 - borderWidth * 2) / count.value : 0;
  });

  const [currentIndex] = useSharedValueFrom(selectedIndex, (curr, prev) => {
    if (curr !== prev) {
      translateX.value = withTiming(curr * sliderWidth.value, {
        duration: 150,
        easing: Easing.inOut(Easing.linear),
      });
    }
  });

  useAnimatedReaction(
    () => sliderWidth.value,
    (curr, prev) => {
      if (curr !== prev) {
        translateX.value = withTiming(curr * currentIndex.value, {
          duration: 150,
          easing: Easing.inOut(Easing.linear),
        });
      }
    },
  );

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (
        e.nativeEvent.layout.width &&
        width.value !== e.nativeEvent.layout.width
      ) {
        width.value = e.nativeEvent.layout.width;
      }
    },
    [width],
  );

  const sliderStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  const sliderInnerStyle = useAnimatedStyle(() => {
    return {
      width: sliderWidth.value,
    };
  });

  const onSegmentPress = useCallback(
    (index: number) => {
      if (index === selectedIndex) return;
      onSelectedIndexChange?.(index);
    },
    [onSelectedIndexChange, selectedIndex],
  );

  const theme = useTheme();

  return (
    <View
      onLayout={onLayout}
      css={`
        align-items: stretch;
        height: 38px;
        position: relative;
        border-radius: 14px;
        background-color: ${theme.components.segment.background};
      `}
      style={style}
    >
      {/* $note(eric): setting width on this view does not work for web */}
      <Animated.View
        style={sliderStyle}
        css={`
          position: absolute;
          left: 2px;
          top: 2px;
          bottom: 2px;
          background-color: ${theme.components.segment.activeBgColor};
          border-radius: 12px;
        `}
      >
        {/* $note(eric): add this and setting width on it will just work for web */}
        <Animated.View style={sliderInnerStyle} />
      </Animated.View>
      <View
        css={`
          flex: 1;
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: space-between;
          align-items: stretch;
        `}
      >
        {segments.map((segment, i) => (
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          <Segment
            key={i}
            index={i}
            active={selectedIndex === i}
            text={segment}
            textStyle={textStyle}
            activeTextStyle={activeTextStyle}
            onPress={onSegmentPress}
          />
        ))}
      </View>
    </View>
  );
});

const Segment = memo(
  ({
    active,
    index,
    text,
    textStyle,
    activeTextStyle,
    onPress,
  }: {
    active: boolean;
    index: number;
    text: string;
    textStyle?: StyleProp<TextStyle>;
    activeTextStyle?: StyleProp<TextStyle>;
    onPress: (index: number) => void;
  }) => {
    const theme = useTheme();
    const onInternalPress = useCallback(() => {
      SafeHaptics.selection();
      onPress(index);
    }, [onPress, index]);
    return (
      <TouchableOpacity
        onPress={onInternalPress}
        css={`
          flex: 1;
          align-items: center;
          justify-content: center;
        `}
      >
        <Text
          numberOfLines={1}
          css={`
            font-family: ${FontFamily.NotoSans.Light};
            font-size: 12px;
            line-height: 14px;
            color: ${theme.components.segment.textColor};
            text-align: center;
          `}
          style={active ? activeTextStyle : textStyle}
        >
          {text}
        </Text>
      </TouchableOpacity>
    );
  },
);
