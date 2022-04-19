import { LicensePlateNoKeyboard } from '@euler/app/components/LicensePlateNoKeyboard';
import { wrapNavigatorScreen } from '@euler/functions';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationOptions } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import { useCallback, useEffect } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const kTranslateY = 200;

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const PlateNoScreen = wrapNavigatorScreen(
  ({
    licensePlateNo,
    onDone,
  }: {
    licensePlateNo?: string;
    onDone?: (value: string) => void;
  }) => {
    const navigation = useNavigation();
    const translateY = useSharedValue(kTranslateY);

    useEffect(() => {
      translateY.value = withTiming(0, { duration: 150 });
    }, [translateY]);

    const style = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
      opacity: interpolate(translateY.value, [0, kTranslateY], [1, 0]),
    }));

    // on android, blur view is implemented via a semi transparent view
    // which can not be animated by BlurView directly, thus, we have to
    // use an independent view and animate its opacity manually instead.
    const backdropStyleAndroid = useAnimatedStyle(() => ({
      opacity: interpolate(translateY.value, [0, kTranslateY], [0.1, 0]),
    }));

    const animatedProps = useAnimatedProps(() => ({
      intensity: interpolate(translateY.value, [0, kTranslateY], [10, 0]),
    }));

    const dismiss = useCallback(() => {
      navigation.goBack();
    }, [navigation]);

    const onBackdropPress = useCallback(() => {
      translateY.value = withTiming(kTranslateY, { duration: 250 }, () => {
        runOnJS(dismiss)();
      });
    }, [dismiss, translateY]);

    const onDonePress = useCallback(
      (value: string) => {
        onDone?.(value);
        onBackdropPress();
      },
      [onBackdropPress, onDone],
    );

    return (
      <View
        css={`
          flex: 1;
        `}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onBackdropPress}>
          {Platform.OS === 'android' && (
            <Animated.View
              css={`
                flex: 1;
                background-color: #000;
              `}
              style={backdropStyleAndroid}
            />
          )}
          {Platform.OS !== 'android' && (
            <AnimatedBlurView
              tint="dark"
              animatedProps={animatedProps}
              css={`
                flex: 1;
              `}
            />
          )}
        </Pressable>
        <Animated.View
          css={`
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
          `}
          style={style}
        >
          <LicensePlateNoKeyboard
            value={licensePlateNo}
            onDone={onDonePress}
            doneButtonText="完成"
          />
        </Animated.View>
      </View>
    );
  },
  {
    presentation: 'transparentModal',
    cardOverlayEnabled: false,
    animationEnabled: false,
    cardStyle: {
      backgroundColor: 'transparent',
    },
    headerShown: false,
  } as StackNavigationOptions,
);
