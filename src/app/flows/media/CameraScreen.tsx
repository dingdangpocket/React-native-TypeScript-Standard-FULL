import {
  CameraView,
  CameraViewMaskType,
} from '@euler/app/components/media/camera/CameraView';
import {
  CameraControlOptions,
  CameraViewLayout,
  CaptureOptions,
} from '@euler/app/components/media/camera/CameraView.shared';
import { MediaCaptureCallback } from '@euler/app/components/media/camera/CaptureButton';
import { ErrorFallback } from '@euler/components/error';
import {
  cameraPhotoOutputMetricsComputed,
  wrapNavigatorScreen,
} from '@euler/functions';
import { useNavigation } from '@react-navigation/native';
import { CardStyleInterpolators } from '@react-navigation/stack';
import * as Sentry from '@sentry/react';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { useCallback, useState } from 'react';
import { LayoutRectangle, Platform } from 'react-native';
import { PhotoFile, VideoFile } from 'react-native-vision-camera';

const kDefaultCaptureOptions: CaptureOptions = {
  skipMetadata: false,
  useSnapshotForAndroid: { quality: 85 },
  qualityPrioritizationIOS: 'speed',
};

const kDefaultControlOptions: CameraControlOptions = {
  flip: true,
  fps: true,
  hdr: true,
  nightMode: true,
};

const kDefaultMask: CameraViewMaskType = { aspectRatio: 4 / 5 };

export type MediaCaptureResult =
  | {
      type: 'photo';
      uri: string;
      file: PhotoFile;
      previewRect: LayoutRectangle;
      cropRect: LayoutRectangle;
      mask: { width: number; height: number };
    }
  | {
      type: 'video';
      uri: string;
      file: VideoFile;
    };

export const CameraScreen = wrapNavigatorScreen(
  ({
    photoOnly,
    mask = kDefaultMask,
    captureOptions = kDefaultCaptureOptions,
    controls = kDefaultControlOptions,
    quality = 100,
    showMediaPicker = true,
    onCaptured,
  }: {
    photoOnly?: boolean;
    quality?: number;
    captureOptions?: CaptureOptions;
    mask?: CameraViewMaskType | null;
    showMediaPicker?: boolean;
    controls?: CameraControlOptions;
    onCaptured?: (result: MediaCaptureResult) => void;
  }) => {
    const navigation = useNavigation();
    const [cameraLayout, setCameraLayout] = useState<CameraViewLayout>();
    const onCameraLayoutChange = useCallback((layout: CameraViewLayout) => {
      setCameraLayout(layout);
    }, []);
    const onCaptureCallback: MediaCaptureCallback = useCallback(
      async result => {
        if (!cameraLayout?.preview || (mask && !cameraLayout?.mask)) {
          return;
        }

        let uri = result.file.path.startsWith('file://')
          ? result.file.path
          : `file://${result.file.path}`;

        if (result.type === 'photo') {
          const { cropRect, maskWidth, maskHeight } =
            cameraPhotoOutputMetricsComputed({
              file: result.file,
              previewRect: cameraLayout.preview,
              maskRect: cameraLayout.mask,
            });
          const transformed = await manipulateAsync(
            uri,
            [
              {
                crop: {
                  originX: cropRect.x,
                  originY: cropRect.y,
                  width: cropRect.width,
                  height: cropRect.height,
                },
              },
            ],
            {
              compress: quality / 100,
              format: SaveFormat.JPEG,
            },
          );
          uri = transformed.uri;
          console.log('transform size: ', transformed);
          onCaptured?.({
            type: 'photo',
            uri,
            file: result.file,
            cropRect,
            previewRect: cameraLayout.preview,
            mask: { width: maskWidth, height: maskHeight },
          });
        } else {
          onCaptured?.({
            type: 'video',
            uri,
            file: result.file,
          });
        }
      },
      [cameraLayout, mask, onCaptured, quality],
    );
    return (
      <Sentry.ErrorBoundary fallback={ErrorFallback}>
        <CameraView
          statusBar={false}
          maxDuration={15000}
          mask={mask ?? undefined}
          photoOnly={photoOnly}
          controls={controls}
          showMediaPicker={showMediaPicker}
          captureOptions={captureOptions}
          onDismiss={() => navigation.goBack()}
          onLayoutChange={onCameraLayoutChange}
          onCaptured={onCaptureCallback}
          css={`
            flex: 1;
          `}
        />
      </Sentry.ErrorBoundary>
    );
  },
  {
    headerShown: false,
    cardStyle: {
      backgroundColor: '#000000',
    },
    cardStyleInterpolator:
      Platform.OS === 'ios' ? CardStyleInterpolators.forVerticalIOS : undefined,
  },
);
