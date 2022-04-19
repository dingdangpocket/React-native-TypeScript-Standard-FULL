import { BlurView } from 'expo-blur';
import { memo } from 'react';
import { Image, StyleSheet, ViewProps } from 'react-native';
import {
  ComposedGesture,
  GestureDetector,
  GestureType,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

export const CameraShadeImageSource = require('./assets/camera-shade-bg.jpg');

export const CameraShade = memo(
  ({
    gesture,
    ...props
  }: { gesture?: ComposedGesture | GestureType } & ViewProps) => {
    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={StyleSheet.absoluteFill} {...props}>
          <Image
            source={CameraShadeImageSource}
            resizeMode="cover"
            css={`
              flex: 1;
            `}
          />
          <BlurView
            style={StyleSheet.absoluteFill}
            intensity={75}
            tint="dark"
          />
        </Animated.View>
      </GestureDetector>
    );
  },
);
