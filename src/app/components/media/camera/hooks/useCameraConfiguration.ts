/**
 * @file: useCameraConfiguration.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { makeDebug } from '@euler/utils';
import { useIsAppActive } from '@euler/utils/hooks/useIsAppActive';
import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAnimatedProps, useSharedValue } from 'react-native-reanimated';
import {
  Camera,
  CameraDeviceFormat,
  CameraPosition,
  CameraRuntimeError,
  frameRateIncluded,
  sortFormats,
  useCameraDevices,
} from 'react-native-vision-camera';
import { kMaxZoomFactor } from '../constants';
import { useCameraAuthorization } from './useCameraAuthorization';

const debug = makeDebug('camera', true);

export const useCameraConfiguration = () => {
  const authorizationStatus = useCameraAuthorization();
  const camera = useRef<Camera>(null);
  const zoom = useSharedValue(0);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);

  const [cameraPosition, setCameraPosition] = useState<CameraPosition>('back');
  const [isHdrEnabled, setHdrEnabled] = useState(false);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [isNightModeEnabled, setNightModeEnabled] = useState(false);

  // https://github.com/mrousavy/react-native-vision-camera/issues/672
  const devices = useCameraDevices('wide-angle-camera');

  // https://github.com/mrousavy/react-native-vision-camera/issues/808
  const device = devices?.[cameraPosition];

  const formats = useMemo<CameraDeviceFormat[]>(() => {
    if (device?.formats == null) return [];
    return device.formats.sort(sortFormats);
  }, [device?.formats]);

  const isAppActive = useIsAppActive();
  const isFocused = useIsFocused();
  const isActive = isAppActive && isFocused;

  const [is60Fps, setIs60Fps] = useState(true);
  const fps = useMemo(() => {
    if (!is60Fps) return 30;

    if (isNightModeEnabled && !device?.supportsLowLightBoost) {
      // User has enabled Night Mode, but Night Mode is not natively supported,
      // so we simulate it by lowering the frame rate.
      return 30;
    }

    const supportsHdrAt60Fps = formats.some(
      f =>
        f.supportsVideoHDR &&
        f.frameRateRanges.some(r => frameRateIncluded(r, 60)),
    );
    if (isHdrEnabled && !supportsHdrAt60Fps) {
      // User has enabled HDR, but HDR is not supported at 60 FPS.
      return 30;
    }

    const supports60Fps = formats.some(f =>
      f.frameRateRanges.some(r => frameRateIncluded(r, 60)),
    );
    if (!supports60Fps) {
      // 60 FPS is not supported by any format.
      return 30;
    }

    // If nothing blocks us from using it, we default to 60 FPS.
    return 60;
  }, [
    device?.supportsLowLightBoost,
    isHdrEnabled,
    isNightModeEnabled,
    formats,
    is60Fps,
  ]);

  const supportsCameraFlipping = useMemo(
    () => devices.back != null && devices.front != null,
    [devices.back, devices.front],
  );
  const supportsFlash = device?.hasFlash ?? false;
  const supportsHdr = useMemo(
    () => formats.some(f => f.supportsVideoHDR || f.supportsPhotoHDR),
    [formats],
  );
  const supports60Fps = useMemo(
    () =>
      formats.some(f =>
        f.frameRateRanges.some(rate => frameRateIncluded(rate, 60)),
      ),
    [formats],
  );
  const canToggleNightMode = isNightModeEnabled
    ? true /* it's enabled so you have to be able to turn it off again */
    : (device?.supportsLowLightBoost ?? false) ||
      fps > 30; /* either we have native support, or we can lower the FPS */

  const format = useMemo(() => {
    let result = formats;
    if (isHdrEnabled) {
      // We only filter by HDR capable formats if HDR is set to true.
      // Otherwise we ignore the `supportsVideoHDR` property and accept formats
      // which support HDR `true` or `false`
      result = result.filter(f => f.supportsVideoHDR || f.supportsPhotoHDR);
    }

    // find the first format that includes the given FPS
    return result.find(f =>
      f.frameRateRanges.some(r => frameRateIncluded(r, fps)),
    );
  }, [formats, fps, isHdrEnabled]);

  // This just maps the zoom factor to a percentage value.
  // so e.g. for [min, neutr., max] values [1, 2, 128] this would result in [0, 0.0081, 1]
  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, kMaxZoomFactor);

  const cameraAnimatedProps = useAnimatedProps(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);

  const neutralZoom = device?.neutralZoom ?? 1;
  useEffect(() => {
    // Run everytime the neutralZoomScaled value changes.
    // (reset zoom when device changes)
    zoom.value = neutralZoom;
  }, [neutralZoom, zoom]);

  const onError = useCallback((error: CameraRuntimeError) => {
    debug(error);
  }, []);

  const onInitialized = useCallback(() => {
    debug('Camera initialized!');
    setIsCameraInitialized(true);
  }, []);

  const onFlipCamera = useCallback(() => {
    setCameraPosition(p => (p === 'back' ? 'front' : 'back'));
  }, []);

  const onToggleFlash = useCallback(() => {
    setFlash(f => (f === 'off' ? 'on' : 'off'));
  }, []);

  const onToggleFps = useCallback(() => {
    setIs60Fps(x => !x);
  }, []);

  const onToggleHdr = useCallback(() => {
    setHdrEnabled(x => !x);
  }, []);

  const onToggleNightMode = useCallback(() => {
    setNightModeEnabled(x => !x);
  }, []);

  // if (device != null && format != null) {
  //   const { photoWidth: w, photoHeight: h } = format;
  //   debug(
  //     `Re-rendering camera view with ${
  //       isActive ? 'active' : 'inactive'
  //     } camera, device: ${device.name} (${w}x${h} @ ${fps}fps)`,
  //   );
  // } else {
  //   debug('re-rendering camera page without active camera');
  // }

  return {
    authorizationStatus,
    camera,
    device,
    format,
    isCameraInitialized,
    isActive,

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
  };
};
