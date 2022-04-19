import { FontFamily } from '@euler/components/typography';
import { SafeHaptics } from '@euler/utils';
import { memo, useCallback } from 'react';
import { Text, TextInput, View, ViewProps } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useTheme } from 'styled-components';

const kSize = 20;
const kScale = 3;
const kPadding = 16;

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const AlphabetIndex = memo(
  ({
    indics,
    onChange,
    ...props
  }: { indics: string[]; onChange?: (index: number) => void } & ViewProps) => {
    const theme = useTheme();
    const activeIndex = useSharedValue(-1);
    const activeStyle = useAnimatedStyle(() =>
      activeIndex.value < 0 || activeIndex.value >= indics.length
        ? {
            opacity: 0,
          }
        : {
            opacity: 1,
            transform: [
              {
                translateY: activeIndex.value * kSize,
              },
            ],
          },
    );

    const activeLetterProps = useAnimatedProps(() => {
      return { text: indics[activeIndex.value] ?? '' } as any;
    });
    const activeLetterStyle = useAnimatedStyle(() =>
      activeIndex.value < 0 || activeIndex.value >= indics.length
        ? {
            opacity: 0,
          }
        : {
            opacity: 1,
            transform: [
              {
                translateY: activeIndex.value * kSize,
              },
            ],
          },
    );

    const indexByOffsetY = (y: number) => {
      'worklet';
      return Math.round((y - kPadding) / kSize);
    };

    const notify = useCallback(
      (index: number) => {
        if (index >= 0 && index < indics.length) {
          SafeHaptics.impact();
          onChange?.(index);
        }
      },
      [indics.length, onChange],
    );

    const gesture = Gesture.Pan()
      .onBegin(e => {
        console.log('start');
        const index = indexByOffsetY(e.y);
        if (index !== activeIndex.value) {
          runOnJS(notify)(index);
        }
        activeIndex.value = index;
      })
      .onUpdate(e => {
        const index = indexByOffsetY(e.y);
        if (index !== activeIndex.value) {
          runOnJS(notify)(index);
        }
        activeIndex.value = index;
      })
      .onEnd(() => {
        activeIndex.value = -1;
      });

    return (
      <>
        <GestureDetector gesture={gesture}>
          <Animated.View
            css={`
              position: absolute;
              top: 20px;
              right: 0;
              padding: ${kPadding}px;
            `}
            {...props}
          >
            <Animated.View
              css={`
                position: absolute;
                left: ${kPadding}px;
                top: ${kPadding}px;
                width: ${kSize}px;
                height: ${kSize}px;
                border-radius: ${kSize / 2}px;
                background-color: ${theme.components.table.index
                  .activeBackgroundColor};
              `}
              style={activeStyle}
            />
            {indics.map(letter => (
              <View
                key={letter}
                css={`
                  width: ${kSize}px;
                  height: ${kSize}px;
                  align-items: center;
                  justify-content: center;
                `}
              >
                <Text
                  css={`
                    font-family: ${FontFamily.NotoSans.Regular};
                    font-size: 12px;
                    color: ${theme.components.table.index.color};
                  `}
                >
                  {letter}
                </Text>
              </View>
            ))}
          </Animated.View>
        </GestureDetector>
        <View
          css={`
            position: absolute;
            top: ${kPadding + 4}px;
            right: 0;
            padding: ${kPadding}px;
          `}
          pointerEvents="none"
        >
          <Animated.View
            css={`
              width: ${kSize * kScale}px;
              height: ${kSize * kScale}px;
              align-items: center;
              justify-content: center;
              left: -${kSize * 2}px;
              top: -${((kScale - 1) * kSize) / 2}px;
            `}
            style={activeLetterStyle}
          >
            <AnimatedTextInput
              css={`
                font-family: ${FontFamily.NotoSans.Regular};
                font-size: ${12 * kScale}px;
                color: ${theme.components.table.index.color};
                padding: 0;
              `}
              editable={false}
              textAlign="center"
              animatedProps={activeLetterProps}
            />
          </Animated.View>
        </View>
      </>
    );
  },
);
