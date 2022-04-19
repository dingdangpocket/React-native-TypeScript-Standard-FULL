import { LayoutProviderView } from '@euler/app/components/layout/LayoutProvider';
import { LibraryButton } from '@euler/app/components/media/LibraryButton';
import { makeDebug } from '@euler/utils';
import { isIosSimulator, isSimulator } from '@euler/utils/device';
import { AntDesign } from '@expo/vector-icons';
import { ImageInfo } from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import React, { FC, memo, Suspense, useCallback, useEffect } from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Camera, VideoFileType } from 'react-native-vision-camera';
import { CameraControls } from './CameraControls';
import { CameraFocus } from './CameraFocus';
import { CameraMask } from './CameraMask';
import { CameraShade } from './CameraShade';
import { CameraTip } from './CameraTip';
import {
  CameraControlOptions,
  CameraViewLayout,
  CameraViewMaskProps,
  CaptureOptions,
} from './CameraView.shared';
import { CaptureButton, MediaCaptureCallback } from './CaptureButton';
import { kDefaultRecordingMinDuration } from './constants';
import { useCameraConfiguration } from './hooks/useCameraConfiguration';
import { useCameraDoubleTapGesture } from './hooks/useCameraDoubleTapGesture';
import { useCameraPinchGesture } from './hooks/useCameraPinchGesture';
import { useCameraTapToFocusGesture } from './hooks/useCameraTapToFocusGesture';
import { useCameraViewLayout } from './hooks/useCameraViewLayout';
import { StatusBarBlurBackground } from './StatusBarBlurBackground';

const debug = makeDebug('camera', true);
const AnimatedCamera = Animated.createAnimatedComponent(Camera);

Animated.addWhitelistedNativeProps({
  zoom: true,
});

export type CameraViewMaskType<
  T extends CameraViewMaskProps = CameraViewMaskProps,
> = T extends { onLayout?: (e: LayoutChangeEvent) => void }
  ? Omit<T, 'onLayout'>
  : T;

export type CameraViewProps = {
  statusBar?: boolean | 'yes' | 'no';
  photoOnly?: boolean;
  showMediaPicker?: boolean;
  captureMethod?: 'camera' | 'snapshot';
  minDuration?: number;
  maxDuration?: number;
  recordingFileType?: VideoFileType;
  initialOpacity?: number;
  mask?: CameraViewMaskType;
  style?: StyleProp<ViewStyle>;
  entryFadeInDuration?: number;
  captureOptions?: CaptureOptions;
  onCaptured?: MediaCaptureCallback;
  onLayoutChange?: (layout: CameraViewLayout) => void;
  onDismiss?: () => void;
  controls?: CameraControlOptions;
};

export const CameraView = memo(
  ({
    recordingFileType,
    statusBar,
    controls,
    photoOnly,
    initialOpacity,
    minDuration = kDefaultRecordingMinDuration,
    maxDuration,
    mask,
    style,
    entryFadeInDuration,
    captureOptions,
    showMediaPicker,
    onDismiss,
    onCaptured,
    onLayoutChange,
  }: CameraViewProps) => {
    const {
      authorizationStatus,
      camera,
      isCameraInitialized,
      isActive,
      device,
      format,

      // camera device capability
      supportsCameraFlipping,
      supportsFlash,
      supportsHdr,
      supports60Fps,
      canToggleNightMode,
      minZoom,
      maxZoom,

      // camera state
      flash,
      zoom,
      fps,
      isHdrEnabled,
      isNightModeEnabled,
      cameraAnimatedProps,

      // camera initialization
      onError,
      onInitialized,

      // camera controls
      onFlipCamera,
      onToggleFlash,
      onToggleFps,
      onToggleHdr,
      onToggleNightMode,
    } = useCameraConfiguration();

    const { cameraAuthStatus, microphoneAuthStatus } = authorizationStatus;

    const isPressingButton = useSharedValue(false);

    const isStatusBarHidden = statusBar === false || statusBar === 'no';

    const {
      layout,
      onPreviewLayout,
      onControlsLayout,
      onMaskLayout,
      onBottomLayout,
    } = useCameraViewLayout({ onLayoutChange });

    const onMediaCaptured: MediaCaptureCallback = useCallback(
      result => {
        if (result.type === 'photo') {
          debug('Photo captured: %O', {
            path: result.file.path,
            width: result.file.width,
            height: result.file.height,
            orientation: result.file.metadata?.Orientation,
          });
        } else {
          debug(`Video captured: %O`, result.file);
        }
        onCaptured?.(result);
      },
      [onCaptured],
    );

    //#region Gesture Handlers

    const onDoubleTap = useCallback(() => {
      onFlipCamera();
    }, [onFlipCamera]);

    const doubleTapGesture = useCameraDoubleTapGesture({
      enabled: isActive,
      onDoubleTap,
    });

    const pinchGesture = useCameraPinchGesture({
      enabled: isActive,
      zoom,
      minZoom,
      maxZoom,
    });

    const { gesture: tapToFocusGesture, ...focusProps } =
      useCameraTapToFocusGesture({
        enabled: isActive,
      });

    const gesture = Gesture.Simultaneous(
      doubleTapGesture,
      pinchGesture,
      tapToFocusGesture,
    );

    //#endregion

    const opacity = useSharedValue(
      initialOpacity ?? (entryFadeInDuration ? 0 : 1),
    );
    const tipOpacity = useSharedValue(0);

    const tipStyle = useAnimatedStyle(() => ({ opacity: tipOpacity.value }));
    const cameraStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    useEffect(() => {
      opacity.value = withTiming(1, {
        duration: entryFadeInDuration ?? 0,
        easing: Easing.inOut(Easing.linear),
      });
      tipOpacity.value = withTiming(1, { duration: 350 });
      setTimeout(() => {
        tipOpacity.value = withTiming(0, {
          duration: 300,
          easing: Easing.inOut(Easing.linear),
        });
      }, 3000);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tipOpacity, opacity]);

    const onImageSelected = useCallback(
      (image: ImageInfo) => {
        const path = image.uri.replace('file://', '');
        if (image.type === 'video') {
          onCaptured?.({
            type: 'video',
            file: {
              path,
              duration: image.duration ?? 0,
            },
          });
        } else {
          onCaptured?.({
            type: 'photo',
            file: {
              path,
              width: image.width,
              height: image.height,
              isRawPhoto: false,
              metadata: image.exif as any,
            },
          });
        }
      },
      [onCaptured],
    );

    return (
      <Suspense fallback={null}>
        <LayoutProviderView style={style}>
          {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
          <ContentWrapper mask={mask} onMaskLayout={onMaskLayout}>
            {device == null ? (
              <CameraShade
                gesture={isIosSimulator() ? gesture : undefined}
                onLayout={onPreviewLayout}
              />
            ) : (
              <GestureDetector gesture={gesture}>
                <Animated.View
                  css={`
                    flex: 1;
                  `}
                  style={cameraStyle}
                >
                  <AnimatedCamera
                    ref={camera}
                    style={[StyleSheet.absoluteFill]}
                    device={device}
                    format={format}
                    fps={fps}
                    hdr={isHdrEnabled}
                    lowLightBoost={
                      device.supportsLowLightBoost && isNightModeEnabled
                    }
                    isActive={isActive}
                    enableZoomGesture={false}
                    enableHighQualityPhotos={
                      captureOptions?.qualityPrioritizationIOS === 'quality'
                    }
                    animatedProps={cameraAnimatedProps}
                    /* photo is always enabled */
                    photo={cameraAuthStatus === 'authorized'}
                    video={cameraAuthStatus === 'authorized' && !photoOnly}
                    audio={microphoneAuthStatus === 'authorized' && !photoOnly}
                    orientation="portrait"
                    frameProcessorFps={1}
                    onInitialized={onInitialized}
                    onError={onError}
                    onLayout={onPreviewLayout}
                  />
                </Animated.View>
              </GestureDetector>
            )}
          </ContentWrapper>
          <CameraFocus camera={camera} {...focusProps} />
          <CameraControls
            style={layout.controls.style}
            flipCameraControl={
              supportsCameraFlipping && controls?.flip !== false
            }
            flashControl={supportsFlash && controls?.flash !== false}
            fpsControl={supports60Fps && controls?.fps !== false}
            hdrControl={supportsHdr && controls?.hdr !== false}
            nightModeControl={
              canToggleNightMode && controls?.nightMode !== false
            }
            isFlashOn={flash === 'on'}
            fps={fps}
            isHdrOn={isHdrEnabled}
            isNightModeOn={isNightModeEnabled}
            onFlipCamera={onFlipCamera}
            onToggleFlash={onToggleFlash}
            onToggleFps={onToggleFps}
            onToggleHdr={onToggleHdr}
            onToggleNightMode={onToggleNightMode}
            onLayout={onControlsLayout}
          />
          <View style={layout.bottomControls.style} onLayout={onBottomLayout}>
            {!photoOnly && <CameraTip style={tipStyle} />}
            <View
              css={`
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: space-between;
                align-items: center;
              `}
            >
              <View
                css={`
                  flex: 1;
                  flex-direction: row;
                  justify-content: center;
                `}
              >
                <TouchableOpacity
                  onPress={onDismiss}
                  hitSlop={{ left: 10, top: 10, right: 10, bottom: 10 }}
                >
                  <AntDesign name="downcircle" size={20} color="white" />
                </TouchableOpacity>
              </View>
              <CaptureButton
                camera={camera}
                fileType={recordingFileType}
                photoOnly={photoOnly}
                options={captureOptions}
                zoom={zoom}
                minZoom={minZoom}
                maxZoom={maxZoom}
                minDuration={minDuration}
                maxDuration={maxDuration}
                flash={supportsFlash ? flash : 'off'}
                enabled={isCameraInitialized && isActive}
                isPressingButton={isPressingButton}
                onMediaCaptured={onMediaCaptured}
                css={`
                  flex-grow: 0;
                  flex-shrink: 0;
                `}
              />
              <View
                css={`
                  flex: 1;
                  flex-direction: row;
                  justify-content: center;
                  align-items: center;
                `}
              >
                {(showMediaPicker || isSimulator()) && (
                  <LibraryButton onSelect={onImageSelected} />
                )}
              </View>
            </View>
          </View>
          <StatusBar hidden={isStatusBarHidden} />
          {!isStatusBarHidden && <StatusBarBlurBackground />}
        </LayoutProviderView>
      </Suspense>
    );
  },
);

const ContentWrapper: FC<{
  mask?: CameraViewMaskType;
  onMaskLayout: (e: LayoutChangeEvent) => void;
}> = memo(({ mask, onMaskLayout, children }) => {
  if (!mask) return children as any;
  return (
    <CameraMask {...mask} onLayout={onMaskLayout}>
      {children}
    </CameraMask>
  );
});
