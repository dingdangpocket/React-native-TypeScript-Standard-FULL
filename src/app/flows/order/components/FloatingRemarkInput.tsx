import { FontFamily } from '@euler/components/typography';
import { useMutilineTextInputDock } from '@euler/functions/useMutilineTextInputDock';
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputSubmitEditingEventData,
  ViewProps,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from 'styled-components';

type Refs = {
  onPress: () => void;
};

type Props = {
  value?: string;
  onDone?: (text: string) => void;
} & ViewProps;

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const kPadding = 15;

export const FloatingRemarkInput = memo(
  forwardRef<Refs, Props>(({ value, onDone, style, ...props }, ref) => {
    const theme = useTheme();
    const { onLayout, animatedStyle, inputRef, onPress } =
      useMutilineTextInputDock();
    useImperativeHandle(ref, () => ({
      onPress,
    }));
    const height = useSharedValue(80);
    const [text, setText] = useState(value ?? '');
    const animatedInputStyle = useAnimatedStyle(() => ({
      height: withTiming(Math.max(height.value, 80), { duration: 50 }),
    }));
    const onSubmitEditing = useCallback(
      (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
        console.log('onSubmitEditing called: ', e.nativeEvent.text);
        onDone?.(e.nativeEvent.text);
      },
      [onDone],
    );
    return (
      <Animated.View
        css={`
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: ${theme.section.background};
          border-top-width: 1px;
          border-top-color: ${theme.components.table.borderColor};
          box-shadow: 0 0 10px #ccc;
          elevation: 2;
        `}
        style={[style, animatedStyle]}
        onLayout={onLayout}
        {...props}
      >
        <AnimatedTextInput
          ref={inputRef}
          style={[
            {
              fontFamily: FontFamily.NotoSans.Regular,
              fontSize: 16,
              lineHeight: 22,
              paddingTop: kPadding,
              paddingBottom: kPadding,
              paddingLeft: kPadding,
              paddingRight: kPadding,
            },
            animatedInputStyle,
          ]}
          multiline
          value={text}
          onChangeText={setText}
          onSubmitEditing={onSubmitEditing}
          onEndEditing={onSubmitEditing}
          placeholder="客户服务备注"
          onContentSizeChange={e => {
            const h = Math.round(e.nativeEvent.contentSize.height);
            height.value = h + kPadding * 2;
          }}
        />
      </Animated.View>
    );
  }),
);
