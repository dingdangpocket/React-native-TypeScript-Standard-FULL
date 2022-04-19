import { useContainerLayout } from '@euler/app/components/layout/LayoutProvider';
import MaskedView from '@react-native-masked-view/masked-view';
import { FC, memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { CameraViewMaskProps } from './CameraView.shared';

const Mask = ({
  w,
  h,
  opacity,
  onLayout,
  ...props
}: {
  w: number;
  h: number;
  width: number;
  height: number;
  opacity?: number;
  onLayout?: (e: LayoutChangeEvent) => void;
}) => {
  const [x, y] = [(props.width - w) / 2, (props.height - h) / 2];
  const pos = useMemo(() => [x, y, w, h], [x, y, w, h]);
  const bgColor = `rgba(0, 0, 0, ${opacity ?? 0.25})`;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const position = pos.map(value => useSharedValue(value));
  useEffect(() => {
    pos.forEach(
      (value, i) => (position[i].value = withTiming(value, { duration: 250 })),
    );
  }, [pos, position]);
  const style = useAnimatedStyle(() => ({
    left: position[0].value,
    top: position[1].value,
    width: position[2].value,
    height: position[3].value,
  }));
  const layout = useRef<LayoutChangeEvent['nativeEvent']['layout']>();
  const onLayoutChange = useCallback(
    (e: LayoutChangeEvent) => {
      if (
        e.nativeEvent.layout.x !== layout.current?.x ||
        e.nativeEvent.layout.y !== layout.current?.y ||
        e.nativeEvent.layout.width !== layout.current?.width ||
        e.nativeEvent.layout.height !== layout.current?.height
      ) {
        layout.current = e.nativeEvent.layout;
        onLayout?.(e);
      }
    },
    [onLayout],
  );
  return (
    <View
      pointerEvents="none"
      css={`
        background-color: ${bgColor};
        flex: 1;
      `}
    >
      <Animated.View
        pointerEvents="none"
        css={`
          border-color: rgba(0, 0, 0, 0.5);
          border-width: 1px;
          background-color: rgba(0, 0, 0, 1);
          position: absolute;
        `}
        style={style}
        onLayout={onLayoutChange}
      />
    </View>
  );
};

export const CameraMaskContent: FC<CameraViewMaskProps> = memo(props => {
  const { width, height } = useContainerLayout();
  if ('width' in props) {
    return (
      <Mask
        w={props.width}
        h={props.height}
        width={width}
        height={height}
        opacity={props.opacity}
        onLayout={props.onLayout}
      />
    );
  } else if ('aspectRatio' in props) {
    const w = width;
    const h = width / props.aspectRatio;
    return (
      <Mask
        w={w}
        h={h}
        width={width}
        height={height}
        opacity={props.opacity}
        onLayout={props.onLayout}
      />
    );
  } else {
    return props;
  }
});

export const CameraMask: FC<CameraViewMaskProps> = memo(
  ({ children, ...props }) => {
    return (
      <MaskedView
        css={`
          flex: 1;
        `}
        maskElement={<CameraMaskContent {...props} />}
      >
        {children}
      </MaskedView>
    );
  },
);
