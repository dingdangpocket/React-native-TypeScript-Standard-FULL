import { ReactElement } from 'react';
import { LayoutChangeEvent, LayoutRectangle } from 'react-native';

export type CameraViewMaskProps =
  | ({ opacity?: number; onLayout?: (e: LayoutChangeEvent) => void } & (
      | {
          width: number;
          height: number;
        }
      | {
          aspectRatio: number;
        }
    ))
  | ReactElement;

export type CameraViewLayout = {
  preview?: LayoutRectangle;
  controls?: LayoutRectangle;
  mask?: LayoutRectangle;
  bottom?: LayoutRectangle;
};

export type CameraControlOptions = {
  flip?: boolean;
  flash?: boolean;
  fps?: boolean;
  hdr?: boolean;
  nightMode?: boolean;
};

export type CaptureOptions = {
  enableAutoDistortionCorrection?: boolean;
  enableAutoRedEyeReduction?: boolean;
  enableAutoStabilization?: boolean;
  qualityPrioritizationIOS?: 'quality' | 'balanced' | 'speed';
  useSnapshotForAndroid?: boolean | { quality: number };
  skipMetadata?: boolean;
};
