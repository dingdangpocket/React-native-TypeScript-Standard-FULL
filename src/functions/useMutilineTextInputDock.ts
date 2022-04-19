/**
 * @file: useMutilineTextInputDock.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useCallback, useEffect, useRef } from 'react';
import {
  Keyboard,
  KeyboardEvent,
  LayoutChangeEvent,
  Platform,
  TextInput,
} from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export const useMutilineTextInputDock = () => {
  const willBeVisible = useRef(false);
  const isVisible = useRef(false);
  const inputRef = useRef<TextInput>(null);
  const height = useSharedValue(0);
  const translateY = useSharedValue(200);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    const show = (e: KeyboardEvent) => {
      if (!willBeVisible.current) {
        if (isVisible.current) {
          if (Platform.OS === 'ios') {
            KeyboardManager.setEnable(true);
          }
          translateY.value = 0;
        }
        return;
      }
      console.log('update translateY to', -e.endCoordinates.height);
      translateY.value = withTiming(-e.endCoordinates.height, {
        duration: e.duration,
        // note(eric): try to find the ios keyboard easing function:
        // https://cubic-bezier.com/#.42,0,.58,1
        // https://gist.github.com/jondot/1317ee27bab54c482e87
        // easing: Easing.bezier(0.1, 0.76, 0.55, 0.9),
        easing: Easing.bezier(0.42, 0, 0.58, 1.0),
      });
      setTimeout(() => {
        willBeVisible.current = false;
        isVisible.current = true;
      }, e.duration * 2);
    };

    const hide = (e: KeyboardEvent) => {
      if (!isVisible.current) return;
      translateY.value = withTiming(height.value, {
        duration: e.duration,
        easing: Easing.bezier(0.38, 0.7, 0.125, 1.0),
      });
    };

    const willShowListener = Keyboard.addListener('keyboardWillShow', e => {
      console.log('keyboardWillShow: ', e.endCoordinates);
      show(e);
    });

    const didShowListener = Keyboard.addListener('keyboardDidShow', e => {
      console.log('keyboardDidShow: ', e.endCoordinates);
      if (Platform.OS !== 'android') return;
      show(e);
    });

    const willHideListener = Keyboard.addListener('keyboardWillHide', e => {
      console.log('keyboardWillHide');
      hide(e);
    });

    const didHideListener = Keyboard.addListener('keyboardDidHide', e => {
      console.log('keyboardDidHide');
      if (!isVisible.current) return;
      if (Platform.OS === 'ios') {
        KeyboardManager.setEnable(true);
      } else {
        hide(e);
      }
      isVisible.current = false;
    });

    return () => {
      willShowListener.remove();
      willHideListener.remove();
      didShowListener.remove();
      didHideListener.remove();
    };
  }, [height.value, translateY]);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const h = e.nativeEvent.layout.height;
      if (height.value !== h) {
        if (height.value === 0) {
          translateY.value = h;
        }
        height.value = h;
      }
    },
    [height, translateY],
  );

  const onPress = useCallback(() => {
    if (Platform.OS === 'ios') {
      KeyboardManager.setEnable(false);
    }
    willBeVisible.current = true;
    isVisible.current = false;
    inputRef.current?.focus();
  }, []);

  return {
    inputRef,
    animatedStyle,
    onLayout,
    onPress,
  };
};
