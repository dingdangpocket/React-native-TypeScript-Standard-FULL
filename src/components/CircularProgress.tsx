import { useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  size: number;
  stroke: string;
  strokeWidth: number;
  radius?: number;
  progress: Animated.DerivedValue<number>;
  style?: StyleProp<ViewStyle>;
};

export const CircularProgress = ({
  progress,
  size,
  stroke,
  strokeWidth,
  style,
  ...props
}: Props) => {
  const radius = props.radius ?? (size - strokeWidth * 2) / 2;
  const c = radius * 2 * Math.PI;
  const animatedProps = useAnimatedProps(() => {
    const p = progress.value;
    return {
      strokeDashoffset: (1 - p) * c,
    };
  });
  const svgStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      transform: [{ rotate: '-90deg' }],
    }),
    [],
  );
  return (
    <Animated.View
      css={`
        width: ${size}px;
        height: ${size}px;
      `}
      style={style}
    >
      <Svg width={size} height={size} style={svgStyle}>
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={c}
          animatedProps={animatedProps}
          strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  );
};
