import {
  formatRgbaColor,
  interpolateConoicGradientColors,
} from '@euler/app/components/score/ColorInterpolate';
import { matrix_init } from '@euler/app/components/score/matrix2d';
import { FontFamily } from '@euler/components/typography';
import { makeDebug } from '@euler/utils';
import { range } from 'ramda';
import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  InteractionManager,
  LayoutChangeEvent,
  Platform,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  G,
  Image,
  Line,
  Mask,
  Path,
  Text as SvgText,
} from 'react-native-svg';

const debug = makeDebug('scoregauge', true);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedGroup = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const BackgroundConicGradientImage = require('./assets/conic-gradient-750.png');
const ForegroundConicGradientImage = require('./assets/outer-conic-gradient-750.png');

const deg2rad_factor = Math.PI / 180.0;
const deg2rad = (x: number) => x * deg2rad_factor;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const rad2deg = (x: number) => x / deg2rad_factor;

interface ScoreGaugeStyle {
  scoreFontFamily: string;
  scoreFontSize: number;
  scoreColor: string;
  scoreLabelFontFamily: string;
  scoreLabelFontSize: number;
  scoreLabelColor: string;
  tickStrokeColor: string;
  tickLabelFontFamily: string;
  tickLabelFontSize: number;
  tickLabelColor: string;
  bgColor?: string;
  outerAxisStrokeColor: string;
  innerAxisStrokeColor: string;
}

const DefaultStyle: ScoreGaugeStyle = {
  scoreColor: '#333',
  scoreFontFamily: FontFamily.NotoSans.Bold,
  scoreFontSize: 68,
  scoreLabelColor: '#999',
  scoreLabelFontFamily: FontFamily.NotoSans.Regular,
  scoreLabelFontSize: 20,
  tickStrokeColor: '#c4c4c4',
  tickLabelFontFamily: FontFamily.NotoSans.Light,
  tickLabelFontSize: 11,
  tickLabelColor: '#666666',
  outerAxisStrokeColor: '#c4c4c4',
  innerAxisStrokeColor: '#c4c4c4',
};

const DefaultGaugeConfig: ScoreGaugeConfig = {
  startAngle: -135,
  endAngle: 135,
  minScore: 0,
  maxScore: 100,
  tickCount: 6,
};

export const ScoreGaugeView = memo(
  ({
    score,
    style,
    label = '综合评分',
    ...props
  }: {
    label?: string;
    score: number;
    theme?: ScoreGaugeStyle;
    style?: StyleProp<ViewStyle>;
  }) => {
    const theme = props.theme ?? DefaultStyle;

    const config = useMemo<ScoreGaugeConfig>(() => DefaultGaugeConfig, []);
    const hasLayout = useRef(false);
    const [dimen, setDimen] = useState<{ width: number; height: number }>({
      width: 0,
      height: 0,
    });

    const colorPlalette = useMemo(
      () =>
        interpolateConoicGradientColors(
          [-39.37, 29.37, 131.25, 228.75],
          ['#40C779', '#E0463D', '#FF9900', '#F2D671'],
        ),
      [],
    );

    const metrics = useMemo(() => {
      const { width, height } = dimen;

      const a = 1 + Math.sqrt(2) / 2;

      // a*r0 <= h, 2 * r0 <= w
      let r0 = height / a;
      if (2 * r0 > width) {
        r0 = width / 2;
      }

      const m: Metrics = {
        r0,
        width: r0 * 2,
        height: r0 * a,
        startAngle: config.startAngle,
        endAngle: config.endAngle,
        cx: r0,
        cy: r0,
        outerAxis: { radius: Math.max(r0 - 9, 0) },
        innerAxis: { radius: Math.max(r0 - 54, 0) },
        backRing: makeRingMetrics(Math.max(r0 - 35, 0), 8),
        frontRing: makeRingMetrics(Math.max(r0 - 34, 0), 26),
        tickLength: 25,
        pointerLength: 44,
        pointerOffset: 10,
        pointerTriangleWidth: 36,
        pointerTriangleHeight: 12,
        outerAxisDashArray: [],
        dashOffset: 0,
        scoreHeight: 0,
        sliceAngle: 0,
        sliceAngleInDeg: 0,
      };

      // compute dasharray for the outer axis for make holes on the axis
      const r = m.outerAxis.radius;

      // angle for each slice
      const sliceCount = config.tickCount - 1;
      const sliceAngleInDeg =
        (config.endAngle - config.startAngle) / sliceCount;
      const sliceAngle = deg2rad(sliceAngleInDeg);

      // angle for the blank arc
      const blankLength = 24;
      const blankAngle = 2 * Math.asin(blankLength / 2 / r);
      const blankArcLength = blankAngle * r;

      for (let i = 0; i < config.tickCount - 1; i++) {
        const angle = sliceAngle - blankAngle;
        const solidArcLength = r * angle;
        m.outerAxisDashArray.push(solidArcLength, blankArcLength);
      }
      m.dashOffset = -(blankAngle / 2) * r;
      m.sliceAngle = sliceAngle;
      m.sliceAngleInDeg = sliceAngleInDeg;
      m.scoreHeight = 0;

      debug(`rendering metrics: `, m);

      return m;
    }, [config.endAngle, config.startAngle, config.tickCount, dimen]);

    const onLayout = useCallback(
      (e: LayoutChangeEvent) => {
        debug('layout changed: ', e.nativeEvent.layout);
        const width = Math.floor(e.nativeEvent.layout.width);
        const height = Math.floor(e.nativeEvent.layout.height);
        if (width !== dimen.width || height !== dimen.height) {
          if (!hasLayout.current) {
            setDimen({
              width,
              height,
            });
            hasLayout.current = true;
          } else {
            void InteractionManager.runAfterInteractions(() => {
              setDimen({
                width,
                height,
              });
            });
          }
        }
      },
      [dimen.height, dimen.width],
    );

    const rotateAngle = -config.startAngle;
    const percentage =
      (score - config.minScore) / (config.maxScore - config.minScore);
    const pointerAngle =
      config.startAngle + percentage * (config.endAngle - config.startAngle);
    const bgConicDash = makeCircleMaskDashline(
      metrics.backRing.radius,
      config.startAngle,
      config.endAngle,
    );
    const fgConicDash = makeCircleMaskDashline(
      metrics.frontRing.radius,
      config.startAngle,
      pointerAngle,
    );

    const outerAxisPath = pathOfArc(
      metrics.cx,
      metrics.cy,
      metrics.outerAxis.radius,
      config.startAngle,
      config.endAngle,
      true,
      true,
    );
    const innerAxisPath = pathOfArc(
      metrics.cx,
      metrics.cy,
      metrics.innerAxis.radius,
      config.startAngle,
      config.endAngle,
      true,
      true,
    );

    const pointer = makePointerPaths(metrics);

    const currentScore = useSharedValue(0);

    const fgConicMaskProps = useAnimatedProps(() => {
      const p =
        (currentScore.value - config.minScore) /
        (config.maxScore - config.minScore);
      const currentAngle =
        config.startAngle + p * (config.endAngle - config.startAngle);
      const strokeDash = makeCircleMaskDashline(
        metrics.frontRing.radius,
        config.startAngle,
        currentAngle,
      );
      return {
        strokeDashoffset: strokeDash.dashOffset,
      };
    });

    const getScoreAngle = (value: number) => {
      'worklet';
      const p = (value - config.minScore) / (config.maxScore - config.minScore);
      const currentAngle =
        config.startAngle + p * (config.endAngle - config.startAngle);
      return currentAngle;
    };

    const pointerProps = useAnimatedProps(() => {
      const currentAngle = getScoreAngle(currentScore.value);
      if (Platform.OS === 'web') {
        return {
          transform: `rotate(${currentAngle}, ${metrics.cx}, ${metrics.cy})`,
        } as any;
      }
      const matrix_op = matrix_init();
      // see react-native-svg/src/lib/extract/extractTransform.ts
      matrix_op.appendTransform(
        metrics.cx,
        metrics.cx,
        1,
        1,
        currentAngle,
        0,
        0,
        metrics.cx,
        metrics.cy,
      );
      const matrix = matrix_op.toArray();
      return {
        matrix,
      };
    });

    const getColor = (value: number) => {
      'worklet';
      const currentAngle = getScoreAngle(value);
      const pointerColorIndex = Math.round(
        (360 + currentAngle - config.endAngle) % 360,
      );
      const color = colorPlalette[pointerColorIndex];
      if (Platform.OS === 'web') {
        // eslint-disable-next-line reanimated/js-function-in-worklet
        return formatRgbaColor(color, 'rgba');
      }
      const r = color[0];
      const g = color[1];
      const b = color[2];
      const a = color[3] ?? 1;

      const intColor =
        ((Math.round(a * 255) << 24) |
          (Math.round(r) << 16) |
          (Math.round(g) << 8) |
          Math.round(b)) >>>
        0;

      return Platform.OS === 'android' ? intColor | 0x0 : intColor;
    };

    const pointerLineProps = useAnimatedProps(() => {
      const color = getColor(currentScore.value);
      return {
        stroke: color,
      };
    });

    const pointerTriangleProps = useAnimatedProps(() => {
      const color = getColor(currentScore.value);
      return {
        stroke: color,
        fill: color,
      };
    });

    const textLayerWidth = metrics.width
      ? (metrics.innerAxis.radius - 16) * 2
      : 0;
    const textLayerHeight = metrics.width
      ? textLayerWidth * (metrics.height / metrics.width)
      : 0;

    const scoreProps = useAnimatedProps(() => {
      return { text: currentScore.value.toFixed(0) } as any;
    });

    const textInputRef = useRef<TextInput>(null);
    const textInputSetNativeProps = useRef<any>();

    useEffect(() => {
      if (!metrics.width || !metrics.height) return;

      currentScore.value = 0;

      if (
        textInputRef.current &&
        Platform.OS === 'web' &&
        !textInputSetNativeProps.current
      ) {
        textInputSetNativeProps.current = textInputRef.current.setNativeProps;
        textInputRef.current.setNativeProps = (values: any) => {
          if ('style' in values && 'text' in values.style) {
            (textInputRef.current as any).value = values.style.text;
          } else {
            textInputSetNativeProps.current?.call(textInputRef.current, values);
          }
        };
      }
      currentScore.value = withTiming(score, {
        duration: 500,
        easing: Easing.inOut(Easing.linear),
      });
    }, [config.minScore, currentScore, metrics.height, metrics.width, score]);

    return (
      <View
        onLayout={onLayout}
        style={[style, metrics.height ? { height: metrics.height } : null]}
        css={`
          align-items: center;
          overflow: hidden;
        `}
      >
        {metrics.width && metrics.height ? (
          <>
            <Svg
              width={metrics.width}
              height={metrics.height}
              viewBox={`0 0 ${metrics.width} ${metrics.height}`}
              css={`
                flex-shrink: 0;
                flex-grow: 0;
              `}
            >
              <Defs>
                <Mask id="bg-conic-mask">
                  <Circle
                    cx={metrics.cx}
                    cy={metrics.cy}
                    r={metrics.backRing.radius}
                    strokeWidth={metrics.backRing.thickness}
                    stroke="#fff"
                    strokeDasharray={bgConicDash.dashArray}
                    strokeDashoffset={bgConicDash.dashOffset}
                    transform={`rotate(${rotateAngle}, ${metrics.cx}, ${metrics.cy})`}
                  />
                </Mask>
                <Mask id="fg-conic-mask">
                  <AnimatedCircle
                    cx={metrics.cx}
                    cy={metrics.cy}
                    r={metrics.frontRing.radius}
                    strokeWidth={metrics.frontRing.thickness}
                    stroke="#fff"
                    strokeDasharray={fgConicDash.dashArray}
                    transform={`rotate(${rotateAngle}, ${metrics.cx}, ${metrics.cy})`}
                    animatedProps={fgConicMaskProps}
                  />
                </Mask>
              </Defs>
              <Image
                xlinkHref={BackgroundConicGradientImage}
                x={0}
                y={0}
                width={metrics.width}
                height={metrics.height}
                mask="url(#bg-conic-mask)"
              />
              <Image
                xlinkHref={ForegroundConicGradientImage}
                x={0}
                y={0}
                width={metrics.width}
                height={metrics.height}
                mask="url(#fg-conic-mask)"
              />
              <Path
                d={outerAxisPath}
                strokeWidth={1}
                stroke={theme.outerAxisStrokeColor}
                fill="none"
                strokeDasharray={metrics.outerAxisDashArray}
                strokeDashoffset={metrics.dashOffset}
              />
              <Path
                d={innerAxisPath}
                strokeWidth={1}
                stroke={theme.innerAxisStrokeColor}
                fill="none"
              />
              {range(0, config.tickCount).map(i => {
                const r1 = metrics.innerAxis.radius;
                const r2 = r1 + metrics.tickLength;
                const { cx, cy, sliceAngleInDeg } = metrics;
                const angle = config.startAngle + i * sliceAngleInDeg;
                const scorePerSlice =
                  (config.maxScore - config.minScore) / (config.tickCount - 1);
                const { x: x1, y: y1 } = angleXY(cx, cy, r1, angle);
                const { x: x2, y: y2 } = angleXY(cx, cy, r2, angle);
                const { x, y } = angleXY(
                  cx,
                  cy,
                  metrics.outerAxis.radius,
                  angle,
                );
                return (
                  <Fragment key={i}>
                    <Line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      strokeWidth={1}
                      stroke={theme.tickStrokeColor}
                    />
                    <SvgText
                      x={x}
                      y={y}
                      dy={3 /* trick: move the text a little bit down */}
                      textAnchor="middle"
                      fontSize={theme.tickLabelFontSize}
                      fontFamily={theme.tickLabelFontFamily}
                      fill={theme.tickLabelColor}
                    >
                      {config.minScore + scorePerSlice * i}
                    </SvgText>
                  </Fragment>
                );
              })}
              <AnimatedGroup animatedProps={pointerProps}>
                <AnimatedPath
                  {...pointer.line}
                  animatedProps={pointerLineProps}
                />
                <AnimatedPath
                  {...pointer.triangle}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animatedProps={pointerTriangleProps}
                />
              </AnimatedGroup>
            </Svg>
            <View
              css={`
                position: absolute;
                left: ${(dimen.width - textLayerWidth) / 2}px;
                top: ${(dimen.height - textLayerHeight) / 2}px;
                width: ${textLayerWidth}px;
                height: ${textLayerHeight}px;
                align-items: center;
                justify-content: center;
              `}
            >
              <AnimatedTextInput
                editable={false}
                textAlign="center"
                ref={textInputRef}
                css={`
                  text-align: center;
                  padding: 0;
                  align-self: stretch;
                  font-family: ${theme.scoreFontFamily};
                  font-size: ${Math.floor(
                    (metrics.width / 358) * theme.scoreFontSize,
                  )}px;
                  color: ${theme.scoreColor};
                `}
                animatedProps={scoreProps}
              />
              <Text
                css={`
                  font-family: ${theme.scoreLabelFontFamily};
                  font-size: ${theme.scoreLabelFontSize}px;
                  color: ${theme.scoreLabelColor};
                  text-align: center;
                `}
              >
                {label}
              </Text>
            </View>
          </>
        ) : null}
      </View>
    );
  },
);

function makeCircleMaskDashline(
  r: number,
  startAngle: number,
  endAngle: number,
) {
  'worklet';
  const c = 2 * Math.PI * r;
  const offset = endAngle - startAngle;
  const p = (360 - offset) / 360;
  const dashArray = [c, c];
  const dashOffset = c * p;
  return { dashOffset, dashArray };
}

function makePointerPaths(metrics: Metrics) {
  //////////////////////////////////////////////////////////
  //           |    -------> tip (x0, y0)                 //
  //           |                                          //
  //           |    -------> normal vertex (x1, y1)       //
  //          / \                                         //
  //         /---\                                        //
  //////////////////////////////////////////////////////////

  // x0, y0 is the coordinate of the tip of the pointer
  const [x0, y0] = [
    metrics.cx,
    metrics.cy - metrics.backRing.outerRadius - metrics.pointerOffset,
  ];
  const [x1, y1] = [x0, y0 + metrics.pointerLength];

  const [w, h] = [metrics.pointerTriangleWidth, metrics.pointerTriangleHeight];

  const [x2, y2] = [x1 - w / 2, y1 + h];
  const [x3, y3] = [x1 + w / 2, y1 + h];

  return {
    line: { d: `M${x0},${y0} L${x1},${y1}`, strokeWidth: 1 },
    triangle: {
      d: `M${x1},${y1} L${x2},${y2} L${x3},${y3} Z`,
      strokeWidth: 3,
    },
  };
}

function makeRingMetrics(outerRadius: number, thickness: number): RingMetics {
  return {
    outerSize: outerRadius * 2,
    outerRadius,
    innerRadius: outerRadius - thickness,
    innerSize: (outerRadius - thickness) * 2,
    radius: outerRadius - thickness / 2,
    size: (outerRadius - thickness / 2) * 2,
    thickness,
  };
}

export function pathOfArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
  largeArcFlag: boolean,
  clockwise: boolean,
) {
  'worklet';

  const { x: x1, y: y1 } = angleXY(cx, cy, r, startAngle);
  const { x: x2, y: y2 } = angleXY(cx, cy, r, endAngle);

  const d = [
    'M',
    x1,
    y1,
    'A',
    r /* rx */,
    r /* ry */,
    0 /* rotation */,
    largeArcFlag ? 1 : 0 /* largeArcFlag */,
    clockwise ? 1 : 0 /* clock wise */,
    x2,
    y2,
  ].join(' ');

  return d;
}

// note: angle start from north clockwise.
export function angleXY(cx: number, cy: number, r: number, angle: number) {
  'worklet';
  const angleInRadians = ((angle - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

type ScoreGaugeConfig = {
  startAngle: number;
  endAngle: number;
  minScore: number;
  maxScore: number;
  tickCount: number;
};

interface RingMetics {
  outerRadius: number;
  innerRadius: number;
  radius: number;
  thickness: number;
  outerSize: number;
  innerSize: number;
  size: number;
}

interface AxisMetrics {
  radius: number;
}

interface Metrics {
  width: number;
  height: number;
  r0: number;
  cx: number;
  cy: number;
  startAngle: number;
  endAngle: number;
  backRing: RingMetics;
  frontRing: RingMetics;
  outerAxis: AxisMetrics;
  innerAxis: AxisMetrics;
  outerAxisDashArray: number[];
  dashOffset: number;
  tickLength: number;
  pointerOffset: number;
  pointerLength: number;
  pointerTriangleWidth: number;
  pointerTriangleHeight: number;
  scoreHeight: number;
  sliceAngle: number;
  sliceAngleInDeg: number;
}
