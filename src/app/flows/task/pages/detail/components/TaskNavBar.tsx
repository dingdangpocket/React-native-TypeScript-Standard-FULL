/* eslint-disable @typescript-eslint/no-use-before-define */
import { AppNavParams } from '@euler/app/Routes';
import { Label } from '@euler/components/typography/Label';
import { useSystemMetrics } from '@euler/functions';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {} from 'react-native-redash';
import { useTaskHeaderOptions } from '../functions/useTaskHeaderOptions';
import { kHeaderMaxExtend, kOffset } from './constants';
import { TaskHeaderMoreButton } from './HeaderOptions';

export const TaskNavBar = memo(
  ({
    taskNo,
    vehicleName,
    licensePlateNo,
    scrollY,
  }: {
    taskNo: string;
    vehicleName: string;
    licensePlateNo: string;
    scrollY: SharedValue<number>;
  }) => {
    const { showActions } = useTaskHeaderOptions({ licensePlateNo, taskNo });
    const navigation = useNavigation<StackNavigationProp<AppNavParams>>();
    const { navBarHeight, safeAreaInsets } = useSystemMetrics();
    const title1Style = useAnimatedStyle(() => ({
      opacity: interpolate(
        scrollY.value,
        [-kHeaderMaxExtend, 0, navBarHeight - kOffset],
        [1, 1, 0],
      ),
    }));
    const title2Style = useAnimatedStyle(() => ({
      opacity: interpolate(
        scrollY.value,
        [-kHeaderMaxExtend, 0, navBarHeight - kOffset],
        [0, 0, 1],
      ),
    }));
    const shadeStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
        scrollY.value,
        [-kHeaderMaxExtend, 0, navBarHeight],
        [0, 0, 1],
      ),
    }));
    return (
      <>
        <Animated.View
          css={`
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            height: ${navBarHeight}px;
            padding-top: ${safeAreaInsets.top}px;
            justify-content: space-between;
            align-items: center;
            flex-direction: row;
            padding-left: 15px;
            padding-right: 16px;
            z-index: 10;
          `}
        >
          <Animated.View style={[StyleSheet.absoluteFill, shadeStyle]}>
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 1 }}
              colors={['#006be4', '#5ba0e0']}
              locations={[0.335, 1]}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          <Animated.View
            css={`
              padding-top: ${safeAreaInsets.top}px;
              justify-content: center;
              align-items: center;
            `}
            style={[StyleSheet.absoluteFill, title1Style]}
          >
            <Label light size={20} color="white">
              任务详情
            </Label>
          </Animated.View>
          <Animated.View
            css={`
              padding-top: ${safeAreaInsets.top}px;
              justify-content: center;
              align-items: center;
            `}
            style={[StyleSheet.absoluteFill, title2Style]}
          >
            <Label
              regular
              size={18}
              color="white"
              css={`
                line-height: 20px;
              `}
            >
              {vehicleName}
            </Label>
            <Label light size={12} color="white">
              {licensePlateNo}
            </Label>
          </Animated.View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="ios-arrow-back-circle-outline"
              size={32}
              color="white"
            />
          </TouchableOpacity>
          <TaskHeaderMoreButton color="white" onPress={showActions} />
        </Animated.View>
      </>
    );
  },
);
