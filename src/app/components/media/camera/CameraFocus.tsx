import { makeDebug } from '@euler/utils';
import { memo, useCallback } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Vector } from 'react-native-redash';
import { Camera } from 'react-native-vision-camera';
import styled from 'styled-components/native';

const kSize = 66;
const kColor = '#2FA557';
const kTick = 5;

const debug = makeDebug('camera:focus');

const TickH = styled.View`
  background-color: ${kColor};
  width: ${kTick}px;
  height: 1px;
  position: absolute;
  top: ${kSize / 2 - 1}px;
`;

const TickV = styled.View`
  background-color: ${kColor};
  width: 1px;
  height: ${kTick}px;
  position: absolute;
  position: absolute;
  left: ${kSize / 2 - 1}px;
`;

export const CameraFocus = memo(
  ({
    camera,
    style,
    focusPoint,
    isFocusRequested,
  }: {
    camera: React.RefObject<Camera>;
    style?: StyleProp<ViewStyle>;
    focusPoint: Vector<SharedValue<number>>;
    isFocusRequested: SharedValue<boolean>;
  }) => {
    const opacity = useSharedValue(0);
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
        left: focusPoint.x.value - kSize / 2,
        top: focusPoint.y.value - kSize / 2,
        transform: [{ scale: scale.value }],
      };
    });
    const onFocus = useCallback(
      (x: number, y: number) => {
        if (!camera.current) {
          // simulate focus effect
          setTimeout(() => {
            isFocusRequested.value = false;
          }, 1000);
          return;
        }
        camera.current
          ?.focus({ x, y })
          .then(() => {
            debug('focused updated to (%s, %s)', x, y);
          })
          .catch(error => {
            debug('failed to request focus: ', error);
          })
          .finally(() => {
            setTimeout(() => {
              isFocusRequested.value = false;
            }, 500);
          });
      },
      [camera, isFocusRequested],
    );

    useAnimatedReaction(
      () => isFocusRequested.value,
      (curr, prev) => {
        if (prev != null && curr !== prev) {
          if (curr) {
            scale.value = 2;
            opacity.value = 1;

            scale.value = withTiming(
              1,
              { duration: 250, easing: Easing.in(Easing.linear) },
              () => {
                runOnJS(onFocus)(focusPoint.x.value, focusPoint.y.value);
                opacity.value = withRepeat(
                  withTiming(0.5, { duration: 150 }),
                  -1,
                );
              },
            );
          } else {
            opacity.value = 0;
          }
        }
      },
    );

    return (
      <Animated.View
        css={`
          position: absolute;
          width: ${kSize}px;
          height: ${kSize}px;
          border-width: 1px;
          border-color: ${kColor};
        `}
        style={[style, animatedStyle]}
        pointerEvents="none"
      >
        <TickH
          css={`
            left: 0;
          `}
        />
        <TickH
          css={`
            right: 0;
          `}
        />
        <TickV
          css={`
            top: 0;
          `}
        />
        <TickV
          css={`
            bottom: 0;
          `}
        />
      </Animated.View>
    );
  },
);
