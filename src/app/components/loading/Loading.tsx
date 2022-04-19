import React, { memo, useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { LoadingProps } from './types';

export const Loading = memo((props: LoadingProps & { visible: boolean }) => {
  const opacity = useSharedValue(0);
  const visible = props.visible;
  const style = useAnimatedStyle(() => {
    return { opacity: opacity.value };
  });

  useEffect(() => {
    const targetOpacity = visible ? 1 : 0;
    opacity.value = withTiming(targetOpacity, {
      duration: 150,
      easing: Easing.inOut(Easing.linear),
    });
  }, [visible, opacity]);

  return (
    <KeyboardAvoidingView
      style={StyleSheet.absoluteFill}
      css={`
        flex: 1;
        justify-content: center;
        align-items: center;
      `}
    >
      {props.backdrop !== false && visible && (
        <View style={StyleSheet.absoluteFill} />
      )}
      <Animated.View
        style={style}
        css={`
          background-color: #222222;
          width: 80px;
          height: 80px;
          border-radius: 20px;
          align-items: center;
          justify-content: center;
        `}
      >
        {props.type === 'loading' ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          props.icon
        )}
        {props.message ? (
          typeof props.message === 'object' ? (
            props.message
          ) : (
            <Text
              css={`
                color: #fff;
                font-family: NotoSans-Light;
                font-size: 12px;
              `}
            >
              {props.message}
            </Text>
          )
        ) : null}
      </Animated.View>
    </KeyboardAvoidingView>
  );
});
