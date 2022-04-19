import { Background, BgColorProp } from '@euler/components/Background';
import { SafeHaptics } from '@euler/utils';
import { memo, useCallback } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import {
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';

type Size = 'large' | 'medium' | 'small' | SwitchButtonSizeMetric;

export type SwitchButtonProps = {
  on?: boolean;
  size?: Size;
  rounded?: boolean;
  style?: StyleProp<ViewStyle>;
  thumbColorActive?: string;
  thumbColorInactive?: string;
  trackColorActive?: BgColorProp;
  trackColorInactive?: BgColorProp;
  borderColorInactive?: string;
  borderColorActive?: string;
  onChange?: (on: boolean) => void;
};

export type SwitchButtonSizeMetric = {
  thumb: number;
  margin: number;
  borderRadius: number;
};

const SizeMetricMap: {
  [p in Exclude<Size, SwitchButtonSizeMetric>]: SwitchButtonSizeMetric;
} = {
  small: { thumb: 24, margin: 1, borderRadius: 3 },
  medium: { thumb: 32, margin: 1.5, borderRadius: 5 },
  large: { thumb: 41, margin: 2, borderRadius: 8 },
};

export const SwitchButton = memo((props: SwitchButtonProps) => {
  const theme = useTheme();
  const {
    on,
    size = 'small',
    rounded,
    borderColorInactive = theme.components.switch.border.inactive,
    borderColorActive = theme.components.switch.border.active,
    thumbColorInactive = theme.components.switch.thumb,
    thumbColorActive = theme.components.switch.thumb.active,
    trackColorInactive = theme.components.switch.track.inactive,
    trackColorActive = theme.components.switch.track.active,
    onChange,
  } = props;
  const {
    thumb: thumbSize,
    margin,
    borderRadius,
  } = typeof size === 'string' ? SizeMetricMap[size] : size;
  const trackSize = thumbSize * 2 + margin * 4 + 2;
  const trackHeight = thumbSize + 2 * margin + 2;
  const thumbOffsetMin = margin;
  const thumbOffsetMax = trackSize - margin - thumbSize - 1;
  const thumbOffset = useSharedValue(on ? thumbOffsetMax : thumbOffsetMin);
  const trackCornerRadius = rounded ? trackHeight / 2 : borderRadius;
  const thumbCornerRadius = rounded ? thumbSize / 2 : borderRadius - margin;

  const containerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      thumbOffset.value,
      [thumbOffsetMin, thumbOffsetMax],
      [borderColorInactive, borderColorActive],
    );
    return {
      borderColor,
    };
  });

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: thumbOffset.value,
        },
      ],
    };
  });

  const trackStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      thumbOffset.value,
      [thumbOffsetMin, thumbOffsetMax],
      [-trackSize, 0],
    );
    return {
      transform: [
        {
          translateX,
        },
      ],
    };
  });

  const vibriate = useCallback(() => {
    SafeHaptics.selection();
  }, []);

  const onTapGestureEvent =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onActive() {
        runOnJS(vibriate)();
        if (onChange) {
          runOnJS(onChange)(!on);
        }
        const targetOffset = on ? thumbOffsetMin : thumbOffsetMax;
        thumbOffset.value = withTiming(targetOffset, {
          duration: 150,
          easing: Easing.inOut(Easing.linear),
        });
      },
    });

  return (
    <TouchableOpacity
      style={props.style}
      css={`
        overflow: hidden;
      `}
    >
      <TapGestureHandler onGestureEvent={onTapGestureEvent}>
        <Animated.View
          css={`
            border-radius: ${trackCornerRadius}px;
            overflow: hidden;
            width: ${trackSize}px;
            height: ${trackHeight}px;
            border-width: 1px;
            border-style: solid;
          `}
          style={[containerStyle]}
        >
          {/* track */}
          <Animated.View
            style={[trackStyle]}
            css={`
              position: absolute;
              left: 0;
              top: 0;
              width: ${trackSize * 2}px;
              height: ${trackHeight}px;
            `}
          >
            <Background
              bgColor={trackColorActive}
              css={`
                position: absolute;
                left: 0;
                top: 0;
                width: ${trackSize}px;
                height: ${trackHeight}px;
              `}
            />
            <Background
              bgColor={trackColorInactive}
              css={`
                position: absolute;
                left: ${trackSize}px;
                top: 0;
                width: ${trackSize}px;
                height: ${trackHeight}px;
              `}
            />
          </Animated.View>
          {/* thumb */}
          <Animated.View
            style={[thumbStyle]}
            css={`
              width: ${thumbSize}px;
              height: ${thumbSize}px;
              margin: ${margin}px 0;
              background-color: ${on ? thumbColorActive : thumbColorInactive};
              border-radius: ${thumbCornerRadius}px;
              box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
            `}
          />
        </Animated.View>
      </TapGestureHandler>
    </TouchableOpacity>
  );
});
