/* eslint-disable @typescript-eslint/no-use-before-define */
import { Img } from '@euler/components/adv-image/AdvancedImage';
import { Label } from '@euler/components/typography/Label';
import { useSystemMetrics } from '@euler/functions';
import * as MatrixMath from '@euler/utils/MatrixMath';
import { LinearGradient } from 'expo-linear-gradient';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {
  kHeaderHeight,
  kHeaderMaxExtend,
  kImageInitialScale,
  kOffset,
} from './constants';

const VehicleInfoView = memo(
  ({
    vehicleName,
    licensePlateNo,
  }: {
    vehicleName: string;
    licensePlateNo: string;
  }) => {
    return (
      <View
        css={`
          padding: 15px 20px;
        `}
      >
        <Label
          light
          color="white"
          size={24}
          numberOfLines={1}
          ellipsizeMode="clip"
        >
          {vehicleName}
        </Label>
        <Label thin color="white">
          {licensePlateNo}
        </Label>
      </View>
    );
  },
);

export const TaskDetailHeaderShade = memo(
  ({ scrollY }: { scrollY: SharedValue<number> }) => {
    const { navBarHeight } = useSystemMetrics();
    const animatedStyle = useAnimatedStyle(() => ({
      height: interpolate(
        scrollY.value,
        [-kHeaderMaxExtend, 0, kHeaderHeight - navBarHeight - kOffset],
        [kHeaderHeight + kHeaderMaxExtend, kHeaderHeight, navBarHeight],
        Extrapolate.CLAMP,
      ),
    }));
    return (
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 1 }}
          colors={['#006be4', '#5ba0e0']}
          locations={[0.335, 1]}
          css={`
            flex: 1;
          `}
        />
      </Animated.View>
    );
  },
);

export const TaskDetailHeader = memo(
  ({
    vehicleImageUrl,
    vehicleName,
    licensePlateNo,
    scrollY,
  }: {
    vehicleImageUrl?: string;
    vehicleName: string;
    licensePlateNo: string;
    scrollY: SharedValue<number>;
  }) => {
    const { safeAreaFrame, navBarHeight } = useSystemMetrics();
    const maxScale = ((safeAreaFrame.width / 2 - 44) * kImageInitialScale) / 90;
    const vehicleInfoWidth = useSharedValue(0);
    const vehicleInfoHeight = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => ({
      height: interpolate(
        scrollY.value,
        [-kHeaderMaxExtend, 0, kHeaderHeight - navBarHeight - kOffset],
        [kHeaderHeight + kHeaderMaxExtend, kHeaderHeight, navBarHeight],
        Extrapolate.CLAMP,
      ),
    }));
    const imageStyle = useAnimatedStyle(() => ({
      transform: [
        {
          scale: interpolate(
            scrollY.value,
            [-kHeaderMaxExtend, 0, navBarHeight],
            [maxScale, kImageInitialScale, 0],
            Extrapolate.CLAMP,
          ),
        },
      ],
    }));
    const vehicleInfoStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        scrollY.value,
        [0, navBarHeight],
        [1, 0],
        Extrapolate.CLAMP,
      );
      const matrix = transformScale(
        scale,
        vehicleInfoWidth.value,
        vehicleInfoHeight.value,
      );
      return {
        opacity: interpolate(
          scrollY.value,
          [-kHeaderMaxExtend, 0, navBarHeight],
          [1, 1, 0],
          Extrapolate.CLAMP,
        ),
        transform: [
          {
            matrix,
          },
        ],
      };
    });

    return (
      <Animated.View
        css={`
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          padding-top: ${navBarHeight}px;
        `}
        style={animatedStyle}
      >
        <Animated.View
          css={`
            position: absolute;
            left: 0;
            bottom: ${kOffset}px;
            right: 120px;
          `}
          style={vehicleInfoStyle}
          onLayout={e => {
            vehicleInfoWidth.value = e.nativeEvent.layout.width;
            vehicleInfoHeight.value = e.nativeEvent.layout.height;
          }}
        >
          <VehicleInfoView
            licensePlateNo={licensePlateNo}
            vehicleName={vehicleName}
          />
        </Animated.View>

        <Animated.View
          css={`
            position: absolute;
            bottom: ${24 + kOffset}px;
            right: -15px;
            width: 90px;
            height: 60px;
          `}
          style={imageStyle}
        >
          <Img
            style={StyleSheet.absoluteFill}
            source={
              vehicleImageUrl
                ? {
                    uri: vehicleImageUrl,
                  }
                : require('@euler/assets/img/default-car-img.png')
            }
          />
        </Animated.View>
      </Animated.View>
    );
  },
);

function applyTransformOrigin(
  matrix: MatrixMath.Matrix3D,
  origin: MatrixMath.Point3D,
) {
  'worklet';
  const x = origin.x;
  const y = origin.y;
  const z = origin.z;
  const translate = MatrixMath.createIdentityMatrix();
  MatrixMath.reuseTranslate3dCommand(translate, x, y, z);
  MatrixMath.multiplyInto(matrix, translate, matrix);
}

function getScaleMatrix(x: number): MatrixMath.Matrix3D {
  'worklet';
  return [x, 0, 0, 0, 0, x, 0, 0, 0, 0, x, 0, 0, 0, 0, 1];
}

function transformScale(scaleBy: number, width: number, height: number) {
  'worklet';
  const matrix = MatrixMath.createIdentityMatrix();
  const toScale = getScaleMatrix(scaleBy);

  applyTransformOrigin(matrix, {
    x: (width * scaleBy - width) / 2,
    y: (height * scaleBy - height) / 2,
    z: 0,
  });

  MatrixMath.multiplyInto(matrix, matrix, toScale);

  return matrix;
}
