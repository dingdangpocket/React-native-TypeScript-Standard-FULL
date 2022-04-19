import { rgbaColorFromColorString } from '@euler/app/components/score/ColorInterpolate';
import { Overlay } from '@euler/app/flows/report/components/VehicleFacadeBirdView.shared';
import {
  Canvas,
  ColorMatrix,
  Group,
  Image,
  Paint,
  useImage,
} from '@shopify/react-native-skia';
import { memo, useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';

// https://fecolormatrix.com/
// https://shopify.github.io/react-native-skia/docs/color-filters
const useColorMatrix = (srcColorString: string, destColorString: string) => {
  return useMemo(() => {
    const srcColor = rgbaColorFromColorString(srcColorString);
    const destColor = rgbaColorFromColorString(destColorString);
    return [
      destColor[0] / srcColor[0],
      0,
      0,
      0,
      0,
      0,
      destColor[1] / srcColor[1],
      0,
      0,
      0,
      0,
      0,
      destColor[2] / srcColor[2],
      0,
      0,
      0,
      0,
      0,
      1,
      0,
    ];
  }, [srcColorString, destColorString]);
};

const OverlayView = memo(
  ({ overlay, scale }: { overlay: Overlay; scale: number }) => {
    const colorMatrix = useColorMatrix('#ffece6', overlay.color);
    const [x, y, w, h] = overlay.coords.map(t => t * scale);
    const source = useImage(overlay.imagePath);
    if (!source) {
      return null;
    }
    return (
      <Group blendMode="srcIn">
        <Paint>
          <ColorMatrix value={colorMatrix} />
        </Paint>
        <Image source={source!} x={x} y={y} width={w} height={h} />
      </Group>
    );
  },
);

export const VehicleFacadeBirdView = memo(
  ({ size, overlays }: { size: number; overlays: Overlay[] }) => {
    const scale = size / 1100;
    const source = useImage(require('@euler/assets/img/car-facade-views.png'));
    if (!source) {
      return (
        <View
          css={`
            width: ${size}px;
            height: ${size}px;
            align-items: center;
            justify-content: center;
          `}
        >
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <Canvas
        css={`
          width: ${size}px;
          height: ${size}px;
          align-self: center;
        `}
      >
        <Image source={source} x={0} y={0} width={size} height={size} />
        <Group>
          {overlays.map((overlay, i) => (
            <OverlayView key={i} overlay={overlay} scale={scale} />
          ))}
        </Group>
      </Canvas>
    );
  },
);
