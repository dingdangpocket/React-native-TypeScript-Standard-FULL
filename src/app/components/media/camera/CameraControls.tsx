import { FontFamily } from '@euler/components/typography';
import { isIosSimulator } from '@euler/utils/device';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { memo } from 'react';
import { Text, View, ViewProps } from 'react-native';
import styled from 'styled-components/native';

export type CameraControlsProps = ViewProps & {
  visibleInSimulator?: boolean;
  flipCameraControl: boolean;
  flashControl: boolean;
  fpsControl: boolean;
  hdrControl: boolean;
  nightModeControl: boolean;

  isFlashOn: boolean;
  fps: number;
  isHdrOn: boolean;
  isNightModeOn: boolean;

  onFlipCamera?: () => void;
  onToggleFlash?: () => void;
  onToggleFps?: () => void;
  onToggleHdr?: () => void;
  onToggleNightMode?: () => void;
};

const Control = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(140, 140, 140, 0.3);
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
`;

export const CameraControls = memo(
  ({
    style,
    flipCameraControl,
    flashControl,
    fpsControl,
    hdrControl,
    nightModeControl,
    visibleInSimulator,
    isFlashOn,
    fps,
    isHdrOn,
    isNightModeOn,
    onFlipCamera,
    onToggleFlash,
    onToggleFps,
    onToggleHdr,
    onToggleNightMode,
    ...props
  }: CameraControlsProps) => {
    return (
      <View style={style} {...props}>
        {(flipCameraControl || (visibleInSimulator && isIosSimulator())) && (
          <Control onPress={onFlipCamera}>
            <Ionicons name="camera-reverse" size={24} color="white" />
          </Control>
        )}
        {(flashControl || (visibleInSimulator && isIosSimulator())) && (
          <Control onPress={onToggleFlash}>
            <Ionicons
              name={isFlashOn ? 'flash-sharp' : 'flash-off-sharp'}
              size={24}
              color={isFlashOn ? 'white' : 'gray'}
            />
          </Control>
        )}
        {(fpsControl || (visibleInSimulator && isIosSimulator())) && (
          <Control onPress={onToggleFps}>
            <View
              css={`
                align-items: center;
                justify-content: center;
                flex: 1;
              `}
            >
              <Text
                css={`
                  font-family: ${FontFamily.NotoSans.Light};
                  font-size: 12px;
                  line-height: 12px;
                  color: white;
                `}
              >
                {fps}
              </Text>
              <Text
                css={`
                  font-size: 6px;
                  line-height: 6px;
                  color: white;
                  font-family: ${FontFamily.NotoSans.Light};
                `}
              >
                FPS
              </Text>
            </View>
          </Control>
        )}
        {(hdrControl || (visibleInSimulator && isIosSimulator())) && (
          <Control onPress={onToggleHdr}>
            <MaterialIcons
              name={isHdrOn ? 'hdr-on' : 'hdr-off'}
              color={isHdrOn ? 'white' : 'gray'}
              size={24}
            />
          </Control>
        )}
        {(nightModeControl || (visibleInSimulator && isIosSimulator())) && (
          <Control onPress={onToggleNightMode}>
            <Ionicons
              name={isNightModeOn ? 'moon' : 'moon-outline'}
              color={isNightModeOn ? 'white' : 'gray'}
              size={24}
            />
          </Control>
        )}
      </View>
    );
  },
);
