/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
import {
  kHandleHeight,
  kMinBottomSheetHeight,
  OcrRecognizePreviewProps,
} from '@euler/app/flows/common/functions/useOcrRecognize';
import { StatusColors } from '@euler/components';
import { FontFamily } from '@euler/components/typography';
import { AsyncState } from '@euler/functions/useFetchAsyncState';
import { SafeHaptics, useIsMobileLayout } from '@euler/utils';
import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet, {
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from 'moti';
import React, { FC, memo, ReactNode, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewProps,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Slot } from 'react-slot-fill';

type Props<T> = {
  label: string;
  state: AsyncState<T | null>;
  children: (result: T) => ReactNode;
  onRetry?: () => void;
} & OcrRecognizePreviewProps;

const NoResultContainer: FC = memo(props => {
  const insets = useSafeAreaInsets();
  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      css={`
        height: ${kMinBottomSheetHeight - kHandleHeight + insets.bottom}px;
        justify-content: center;
        align-items: center;
      `}
    >
      {props.children}
    </MotiView>
  );
});

const OcrRecognizePreview = <T extends unknown>({
  label,
  state,
  imageUri,
  children,
  onRetry,
}: Props<T>) => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobileLayout = useIsMobileLayout();
  const previewWidth = isMobileLayout ? width : 375;
  const previewHeight = previewWidth * 0.8;
  const snapPoints = useMemo(
    () => [
      kMinBottomSheetHeight + insets.bottom,
      height - previewHeight + 32,
      height - insets.top,
    ],
    [height, insets.bottom, insets.top, previewHeight],
  );
  const bottomSheetRef = useRef<BottomSheet>(null);
  const animatedPosition = useSharedValue(0);
  const animatedImageStyle = useAnimatedStyle(() => {
    const top = animatedPosition.value + 32;
    const scale = Math.max(1, top / previewHeight);
    const [w, h] = [previewWidth * scale, previewHeight * scale];
    const left = (previewWidth - w) / 2;
    return {
      width: w,
      height: h,
      left,
    };
  });
  return (
    <>
      <View
        css={`
          align-items: center;
          background-color: #000;
          flex: 1;
        `}
      >
        <View style={StyleSheet.absoluteFill}>
          <View
            css={`
              flex: 1;
              width: ${width}px;
            `}
          >
            <Animated.Image
              source={{ uri: imageUri }}
              resizeMode="cover"
              css={`
                position: absolute;
                width: ${previewWidth}px;
                height: ${previewHeight}px;
                left: 0;
                top: 0;
                right: 0;
              `}
              style={animatedImageStyle}
            />
          </View>
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          index={state.status === 'success' ? 1 : 0}
          snapPoints={snapPoints}
          animatedPosition={animatedPosition}
          backgroundStyle={{ backgroundColor: '#fff' }}
          footerComponent={Footer}
          onChange={() => SafeHaptics.impact()}
        >
          {state.status === 'loading' ? (
            <NoResultContainer>
              <ActivityIndicator style={{ transform: [{ scale: 1.5 }] }} />
            </NoResultContainer>
          ) : state.status === 'error' ? (
            <NoResultContainer>
              <ErrorView label={label} error={state.error} onRetry={onRetry} />
            </NoResultContainer>
          ) : state.result == null ? (
            <NoResultContainer>
              <NoResultView label={label} />
            </NoResultContainer>
          ) : (
            <BottomSheetView
              css={`
                flex: 1;
              `}
            >
              {children(state.result)}
            </BottomSheetView>
          )}
        </BottomSheet>
      </View>
      <StatusBar hidden={false} style="light" />
    </>
  );
};

export default memo(OcrRecognizePreview) as typeof OcrRecognizePreview;

const Footer: FC<BottomSheetFooterProps> = memo(props => {
  return (
    <BottomSheetFooter {...props} bottomInset={0}>
      <Slot name="ocr-preview-footer" />
    </BottomSheetFooter>
  );
});

const NoResultView = memo(({ label }: { label: string }) => {
  return (
    <>
      <MaterialIcons name="error" size={60} color={StatusColors.Info} />
      <Text
        css={`
          font-family: ${FontFamily.NotoSans.Light};
          font-size: 16px;
          line-height: 20px;
          text-align: center;
          margin-top: 20px;
        `}
      >
        对不起，无法识别您所拍{label}，请返回重新扫描！
      </Text>
    </>
  );
});

const ErrorView = memo(
  ({
    label,
    error,
    onRetry,
    ...props
  }: { label: string; error: Error; onRetry?: () => void } & ViewProps) => {
    return (
      <View
        css={`
          flex: 1;
          padding: 15px 32px 32px 32px;
        `}
        {...props}
      >
        <MaterialIcons name="error" size={60} color={StatusColors.Danger} />
        <Text
          css={`
            font-family: ${FontFamily.NotoSans.Light};
            font-size: 16px;
            line-height: 20px;
            text-align: center;
            margin-top: 20px;
          `}
        >
          对不起，识别{label}
          时发生了一个错误，请确保您的网络连接正常，然后稍后重试:
        </Text>
        <Text
          css={`
            font-family: ${FontFamily.NotoSans.Light};
            font-size: 12px;
            line-height: 16px;
            color: ${StatusColors.Danger};
            text-align: center;
            margin-top: 10px;
          `}
          numberOfLines={3}
        >
          {error.message || '未知错误类型'}
        </Text>
        <TouchableOpacity
          css={`
            padding: 0 30px;
            height: 32px;
            border-radius: 16px;
            background-color: ${StatusColors.Info};
            justify-content: center;
            align-items: center;
            margin-top: 20px;
          `}
          onPress={onRetry}
        >
          <Text
            css={`
              font-family: ${FontFamily.NotoSans.Regular};
              font-size: 16px;
              line-height: 32px;
              color: #fff;
            `}
          >
            重试
          </Text>
        </TouchableOpacity>
      </View>
    );
  },
);
