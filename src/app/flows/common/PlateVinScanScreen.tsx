import { CameraView } from '@euler/app/components/media/camera/CameraView';
import {
  CameraControlOptions,
  CameraViewLayout,
  CaptureOptions,
} from '@euler/app/components/media/camera/CameraView.shared';
import { MediaCaptureCallback } from '@euler/app/components/media/camera/CaptureButton';
import { useCameraOrientationSensor } from '@euler/app/components/media/camera/hooks/useCameraOrientationSensor';
import { AppNavParams } from '@euler/app/Routes';
import { SegmentControl } from '@euler/components';
import { ErrorFallback } from '@euler/components/error';
import { FontFamily } from '@euler/components/typography/fonts';
import { wrapNavigatorScreen } from '@euler/functions';
import { cameraPhotoOutputMetricsComputed } from '@euler/functions/cameraPhotoOutputMetricsComputed';
import { MediaService } from '@euler/lib/media/MediaService';
import { VehicleServiceInfo } from '@euler/services/vehicle-info.service';
import { isNotNull } from '@euler/utils';
import { measure } from '@euler/utils/measure';
import { useNavigation } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack';
import * as Sentry from '@sentry/react';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';

type Mode = 'plate' | 'vin';
const Modes: Mode[] = ['plate', 'vin'];

const ModeNameMap: { [p in Exclude<Mode, 'both'>]: string } = {
  plate: '车牌号',
  vin: 'VIN码',
};

const kCaptureOptions: CaptureOptions = {
  skipMetadata: false,
  useSnapshotForAndroid: { quality: 85 },
  qualityPrioritizationIOS: 'speed',
};

const kControlOptions: CameraControlOptions = {
  flip: false,
  fps: false,
  hdr: false,
  nightMode: false,
};

export type PlateVinScanProps = {
  mode?: Mode;
  modal?: boolean;
  onConfirm?: (
    mode: Mode,
    value: string,
    imageUrl: string | undefined,
    serviceInfo?: VehicleServiceInfo,
  ) => void;
};

export const PlateVinScanScreen = wrapNavigatorScreen(
  (props: PlateVinScanProps) => {
    const navigation = useNavigation<StackNavigationProp<AppNavParams>>();
    const { width } = useWindowDimensions();
    const orientation = useCameraOrientationSensor();

    const { mode, onConfirm } = props;
    const modes = useMemo(() => Modes.filter(x => !mode || x === mode), [mode]);
    const [modeIndex, setModeIndex] = useState(0);
    const currentMode = modes[modeIndex];

    const segments = useMemo(() => modes.map(x => ModeNameMap[x]), [modes]);
    const [segmentPosY, setSegmentPosY] = useState<number>();

    const cameraLayout = useRef<CameraViewLayout>();
    const onCameraLayoutChange = useCallback((layout: CameraViewLayout) => {
      cameraLayout.current = layout;
      //console.log('camera view layout: ', layout);
      if (layout.bottom && layout.mask) {
        const minY = layout.mask.y + layout.mask.height + 30;
        setSegmentPosY(Math.max(layout.bottom.y - 128, minY));
      }
    }, []);

    const mask = useMemo(() => {
      if (!orientation) return undefined;
      const obj = [width - 30, currentMode === 'plate' ? 140 : 100];
      if (orientation === 'landscape') {
        [obj[0], obj[1]] = [obj[1], obj[0]];
      }
      return { width: obj[0], height: obj[1] };
    }, [currentMode, orientation, width]);

    const onPhotoCaptured: MediaCaptureCallback = useCallback(
      async result => {
        if (
          result.type === 'video' ||
          !cameraLayout.current?.preview ||
          !cameraLayout.current?.mask
        ) {
          return;
        }

        const { cropRect, maskWidth, maskHeight } =
          cameraPhotoOutputMetricsComputed({
            file: result.file,
            previewRect: cameraLayout.current.preview,
            maskRect: cameraLayout.current.mask,
          });

        const generated = await measure(async () => {
          return await manipulateAsync(
            result.file.path,
            [
              orientation === 'landscape'
                ? {
                    rotate: -90,
                  }
                : undefined,
            ].filter(isNotNull),
            {
              compress: 0.8,
              format: SaveFormat.JPEG,
            },
          );
        }, 'image manipulation');

        await MediaService.shared.saveToLibrary({
          type: 'localFileUri',
          fileUri: generated.uri,
        });

        if (mode === 'plate') {
          navigation.push('_plateRecognizeResult', {
            imageUri: generated.uri,
            imageSize: {
              width: generated.width,
              height: generated.height,
            },
            maskSize: {
              width: maskWidth,
              height: maskHeight,
            },
            cropRect,
            onConfirm: (plateNo, imageUrl, vehicleInfo) => {
              navigation.goBack();
              onConfirm?.('plate', plateNo, imageUrl, vehicleInfo);
            },
          });
        } else {
          navigation.push('_vinRecognizeResult', {
            imageUri: generated.uri,
            imageSize: {
              width: generated.width,
              height: generated.height,
            },
            maskSize: {
              width: maskWidth,
              height: maskHeight,
            },
            cropRect,
            onConfirm: (vin, imageUrl, vehicleInfo) => {
              navigation.goBack();
              onConfirm?.('vin', vin, imageUrl, vehicleInfo);
            },
          });
        }
      },
      [mode, navigation, onConfirm, orientation],
    );

    return (
      <Sentry.ErrorBoundary fallback={ErrorFallback}>
        <CameraView
          statusBar={false}
          maxDuration={15000}
          mask={mask}
          photoOnly={true}
          captureOptions={kCaptureOptions}
          controls={kControlOptions}
          onDismiss={() => navigation.goBack()}
          onLayoutChange={onCameraLayoutChange}
          onCaptured={onPhotoCaptured}
          css={`
            flex: 1;
          `}
        />
        {segments.length > 1 && (
          <View
            css={`
              position: absolute;
              left: 0;
              right: 0;
              top: ${segmentPosY ?? -300}px;
              padding: 0 15px;
            `}
          >
            <SegmentControl
              segments={segments}
              selectedIndex={modeIndex}
              onSelectedIndexChange={setModeIndex}
              textStyle={{
                color: '#fff',
                fontFamily: FontFamily.NotoSans.Light,
              }}
              activeTextStyle={{
                color: '#000',
                fontFamily: FontFamily.NotoSans.Light,
              }}
              css={`
                background-color: transparent;
                border-color: #aaa;
                border-width: 1px;
              `}
            />
          </View>
        )}
      </Sentry.ErrorBoundary>
    );
  },
  ({ route }) =>
    ({
      presentation: route.params.modal ? 'modal' : 'card',
      headerStatusBarHeight: 0,
      cardOverlayEnabled: Boolean(route.params.modal),
      detachPreviousScreen: false,
      headerShown: false,
      title: '',
      cardOverlay: route.params.modal
        ? () => (
            <View
              css={`
                flex: 1;
                background-color: transparent;
              `}
            />
          )
        : undefined,
      cardStyle: {
        backgroundColor: '#000000',
        flex: 1,
      },
      cardStyleInterpolator: route.params.modal
        ? undefined
        : Platform.OS === 'ios'
        ? CardStyleInterpolators.forVerticalIOS
        : undefined,
    } as StackNavigationOptions),
);
