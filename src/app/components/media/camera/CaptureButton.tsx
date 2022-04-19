import { Colors, StatusColors } from '@euler/components';
import { CircularProgress } from '@euler/components/CircularProgress';
import { makeDebug, SafeHaptics } from '@euler/utils';
import { BlurView } from 'expo-blur';
import { memo, useCallback, useRef } from 'react';
import { Platform, StyleSheet, ViewProps } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type {
  Camera,
  PhotoFile,
  VideoFile,
  VideoFileType,
} from 'react-native-vision-camera';
import { CaptureOptions } from './CameraView.shared';

const debug = makeDebug('camera', true);

const kButtonSize = 70;
const kBorderWidth = 10;
const kStartRecordingDelay = 200;
const kMaxScale = 1.3;
const kCircleStrokeWidth = 3;
const kCircleSpacing = 2;
const kMaxPanRatio = 0.3;
const kDefaultQuality = 85;
const kDefaultVideoFileType = 'mp4';

const kDefaultOptions: CaptureOptions = {
  skipMetadata: false,
  qualityPrioritizationIOS: 'speed',
};

export type MediaCaptureCallback = (
  media:
    | { type: 'photo'; file: PhotoFile }
    | { type: 'video'; file: VideoFile },
) => void;

interface Props extends ViewProps {
  camera: React.RefObject<Camera>;
  fileType?: VideoFileType;
  flash: 'off' | 'on';
  options?: CaptureOptions;
  enabled: boolean;
  photoOnly?: boolean;
  minDuration?: number;
  maxDuration?: number;
  minZoom: number;
  maxZoom: number;
  zoom: Animated.SharedValue<number>;
  isPressingButton: Animated.SharedValue<boolean>;
  onMediaCaptured: MediaCaptureCallback;
}

export const CaptureButton = memo(
  ({
    camera,
    fileType = kDefaultVideoFileType,
    options = kDefaultOptions,
    photoOnly,
    minZoom,
    maxZoom,
    zoom,
    flash,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    enabled,
    style,
    minDuration,
    maxDuration,
    onMediaCaptured,
    ...props
  }: Props) => {
    const captureMode = useSharedValue<'photo' | 'video'>('photo');
    const pressStartTime = useSharedValue(0);
    const isRecording = useSharedValue(false);
    const recordingProgress = useSharedValue(0);
    const isPressingButton = useSharedValue(false);
    const recordingStoppedFlag = useRef(false);

    //#region Media capture

    const takePhoto = useCallback(async () => {
      if (!camera.current) return;
      let usingSnapshot = false;

      try {
        const {
          skipMetadata = kDefaultOptions.skipMetadata,
          qualityPrioritizationIOS = kDefaultOptions.qualityPrioritizationIOS,
          enableAutoDistortionCorrection,
          enableAutoRedEyeReduction,
          enableAutoStabilization,
        } = options;
        if (Platform.OS === 'android' && options.useSnapshotForAndroid) {
          usingSnapshot = true;
          const quality =
            typeof options.useSnapshotForAndroid === 'object'
              ? options.useSnapshotForAndroid.quality
              : kDefaultQuality;
          debug('taking snapshot...');
          const photo = await camera.current.takeSnapshot({
            flash,
            quality,
            skipMetadata,
          });
          onMediaCaptured({ type: 'photo', file: photo });
        } else {
          debug('taking photo...');
          const photo = await camera.current.takePhoto({
            flash,
            skipMetadata,
            qualityPrioritization: qualityPrioritizationIOS,
            enableAutoDistortionCorrection,
            enableAutoRedEyeReduction,
            enableAutoStabilization,
          });
          onMediaCaptured({ type: 'photo', file: photo });
        }
      } catch (e) {
        debug('error take %s: ', usingSnapshot ? 'snapshot' : 'photo', e);
      }
    }, [camera, flash, onMediaCaptured, options]);

    const onRecordingStopped = useCallback(() => {
      isRecording.value = false;
      recordingProgress.value = 0;
      recordingStoppedFlag.current = true;
      debug('video recording stopped');
    }, [isRecording, recordingProgress]);

    const stopRecording = useCallback(
      async (takePhotoAfterwards?: boolean) => {
        try {
          // prevent multiple stopping in some cases
          if (!isRecording.value) return;

          debug('stopping recording...');

          isRecording.value = false;
          recordingProgress.value = 0;

          if (camera.current) {
            await camera.current.stopRecording();
            debug('stopping recording requested');

            if (takePhotoAfterwards) {
              recordingStoppedFlag.current = false;
              const timer = setInterval(async () => {
                if (recordingStoppedFlag.current) {
                  clearInterval(timer);
                  await takePhoto();
                }
              }, 100);
            }
          } else {
            onRecordingStopped();
          }
        } catch (e) {
          debug('failed to stop recording: ', e);
        }
      },
      [camera, isRecording, onRecordingStopped, recordingProgress, takePhoto],
    );

    const startRecording = useCallback(() => {
      try {
        isRecording.value = true;
        SafeHaptics.selection();

        debug('start recording...');

        if (maxDuration) {
          recordingProgress.value = withTiming(
            1,
            {
              duration: maxDuration,
              easing: Easing.linear,
            },
            () => {
              // reset so that when tap ends, nothing will happend.
              isPressingButton.value = false;
              runOnJS(stopRecording)();
            },
          );
        }

        if (!camera.current) return;

        camera.current.startRecording({
          flash,
          fileType,
          onRecordingError: error => {
            debug('recording failed: ', error);
            onRecordingStopped();
          },
          onRecordingFinished: video => {
            if (captureMode.value === 'video') {
              onMediaCaptured({ type: 'video', file: video });
            }
            onRecordingStopped();
          },
        });
        // todo: wait until startRecording returns to actually find out
        // if the recording has successfully started
        debug('recording started');
      } catch (e) {
        debug('failed to start recording: ', e);
      }
    }, [
      camera,
      captureMode.value,
      fileType,
      flash,
      isPressingButton,
      isRecording,
      maxDuration,
      onMediaCaptured,
      onRecordingStopped,
      recordingProgress,
      stopRecording,
    ]);

    //#endregion

    //#region Gesture handlers

    const tryStartRecording = useCallback(
      (now: number) => {
        setTimeout(() => {
          if (pressStartTime.value === now) {
            // user is still pressing down after 200ms, so his intention is
            // to create a video
            startRecording();
          }
        }, kStartRecordingDelay);
      },
      [pressStartTime, startRecording],
    );

    const tapGesture = Gesture.Tap()
      // prevent the tap gesture to fail to fast (default 500ms)
      .maxDuration(photoOnly ? 500 : 99999999999)
      .onBegin(() => {
        const now = Date.now();
        pressStartTime.value = now;
        if (!photoOnly) {
          runOnJS(tryStartRecording)(now);
        }
        isPressingButton.value = true;
      })
      .onEnd((_, success) => {
        if (!isPressingButton.value) {
          return;
        }

        isPressingButton.value = false;

        if (pressStartTime.value === 0 || !success) {
          console.log('abort');
          return;
        }

        const now = Date.now();
        const diff = now - pressStartTime.value;
        console.log('start time: ', pressStartTime.value, ', diff: ', diff);
        pressStartTime.value = 0;

        if (
          photoOnly ||
          diff < kStartRecordingDelay ||
          (minDuration && diff < minDuration)
        ) {
          captureMode.value = 'photo';
          // user has released the button within 200ms, so his intention is
          // to take a single picture.
          if (isRecording.value) {
            runOnJS(stopRecording)(true);
          } else {
            runOnJS(takePhoto)();
          }
        } else {
          captureMode.value = 'video';
          // user has held the button for more than 200ms, so he has been
          // recording this entire time.
          runOnJS(stopRecording)();
        }
      });

    // pan gesture context variables
    const panStartY = useSharedValue(0);
    const panMinY = useSharedValue(0);
    const panMaxOffset = useSharedValue(0);
    const panInitialOffset = useSharedValue(0);
    const panGesture = Gesture.Pan()
      .activeOffsetY([-2, 2])
      .onBegin(e => {
        panStartY.value = e.absoluteY;
        panMinY.value = panStartY.value * kMaxPanRatio;
        panMaxOffset.value = panStartY.value - panMinY.value;
        panInitialOffset.value = interpolate(
          zoom.value,
          [minZoom, maxZoom],
          [0, panMaxOffset.value],
          Extrapolate.CLAMP,
        );
      })
      .onUpdate(e => {
        zoom.value = interpolate(
          e.absoluteY - panInitialOffset.value,
          [panMinY.value, panStartY.value],
          [maxZoom, minZoom],
          Extrapolate.CLAMP,
        );
      });

    //#endregion

    const gesture = Gesture.Simultaneous(tapGesture, panGesture);

    //#region Button style

    const scale = useDerivedValue(() => {
      return withSpring(
        interpolate(isRecording.value ? 1 : 0, [0, 1], [1, kMaxScale]),
        { damping: 10, stiffness: 300 },
      );
    });

    const buttonStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: scale.value,
          },
        ],
      };
    });

    const innerButtonStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: maxDuration ? '#fff' : StatusColors.Danger,
        transform: [
          {
            scale: interpolate(scale.value, [1, kMaxScale], [1, 0.4]),
          },
        ],
      };
    });

    const progressStyle = useAnimatedStyle(() => {
      return {
        opacity: recordingProgress.value ? 1 : 0,
      };
    });

    //#endregion

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View
          css={`
            width: ${kButtonSize}px;
            height: ${kButtonSize}px;
            border-radius: ${kButtonSize / 2}px;
            align-items: center;
            justify-content: center;
          `}
          style={[style, buttonStyle]}
          {...props}
        >
          <BlurView
            style={StyleSheet.absoluteFill}
            css={`
              width: ${kButtonSize}px;
              height: ${kButtonSize}px;
              border-radius: ${kButtonSize / 2}px;
              overflow: hidden;
            `}
            intensity={100}
            tint="default"
          />
          <CircularProgress
            progress={recordingProgress}
            size={kButtonSize}
            stroke={Colors.WeixinPrimary}
            strokeWidth={kCircleStrokeWidth}
            style={[StyleSheet.absoluteFill, progressStyle]}
            radius={kButtonSize / 2 - kCircleSpacing}
          />
          <Animated.View
            css={`
              width: ${kButtonSize - kBorderWidth * 2}px;
              height: ${kButtonSize - kBorderWidth * 2}px;
              border-radius: ${(kButtonSize - kBorderWidth * 2) / 2}px;
            `}
            style={innerButtonStyle}
          />
        </Animated.View>
      </GestureDetector>
    );
  },
);
