/* eslint-disable @typescript-eslint/no-use-before-define */
import { StatusColors } from '@euler/components';
import { PredefinedHitSlops } from '@euler/functions';
import { useSharedValueFrom } from '@euler/utils/hooks';
import { AntDesign } from '@expo/vector-icons';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  LayoutRectangle,
  StyleProp,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Circle, ForeignObject, Path, Rect } from 'react-native-svg';
import { TagInfo } from '../functions/TagInfo';
import {
  DefaultAnnotationTagStyle,
  DefaultTagFontFamily,
  DefaultTagFontSize,
} from '../functions/tagPresets';

export type TagInteractionContext = {
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  zIndex: SharedValue<number>;
};

const kMaxWidth = 150;
const kTextBoxPadding = [15, 3] as const;
const kDefaultFontSize = DefaultTagFontSize;
const kConnectorStartAngle = 40; // in degrees
const kConnectorEndWidth = 15;
const kConnectorStrokeWidth = 1;
const kSolidCircleRadius = 4;
const kOutlineCircleRadius = 6;
const kTextBoxOffsetY = 0;
const kTextBorderStrokeWidth = 1;
const kOutlineCircleStrokeWidth = 1;

type Point2D = { x: number; y: number };
type Circle2D = { cx: number; cy: number; r: number };
type Path2D = Point2D[];
type Text2D = Point2D & { w: number; h: number };
type Rect2D = {
  x: number;
  y: number;
  w: number;
  h: number;
  rx: number;
  ry: number;
};

type TagRenderingMetrics = {
  width: number;
  height: number;
  solidCircle: Circle2D;
  outlineCircle: Circle2D;
  connector: Path2D;
  textBox: Rect2D;
  text: Text2D;
  anchorPoint: Point2D;
};

type Props = {
  tag: TagInfo;
  style?: StyleProp<ViewStyle>;
  canvasWidth: number;
  canvasHeight: number;
  onReady?: (id: string, interaction: TagInteractionContext) => void;
  onPress?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMoveBegin?: (id: string, x: number, y: number) => void;
  onMoveEnd?: (id: string, x: number, y: number) => void;
  onLayout?: (id: string, layout: LayoutRectangle) => void;
};

export const TagView = memo((props: Props) => {
  // we have to wait for the text layout to determine the dimensions
  // and internal layout of the child shapes of the tag svg element.
  const [textLayout, setTextLayout] = useState<LayoutRectangle>();

  const metrics = useTagRenderingMetrics(textLayout);

  const onTextLayout = useCallback((e: LayoutChangeEvent) => {
    setTextLayout(e.nativeEvent.layout);
  }, []);

  return (
    <>
      {metrics != null ? <TagRenderer {...props} metrics={metrics} /> : null}
      {/** hidden text used for text calculation */}
      <Text
        css={`
          font-family: ${DefaultTagFontFamily};
          font-size: ${kDefaultFontSize}px;
          max-width: ${kMaxWidth}px;
          opacity: 0;
          position: absolute;
          left: -1000000px;
          top: -1000000px;
        `}
        numberOfLines={0}
        onLayout={onTextLayout}
      >
        {props.tag.name}
      </Text>
    </>
  );
});

export const TagRenderer = memo(
  ({
    tag,
    style,
    canvasWidth,
    canvasHeight,
    onPress,
    onReady,
    onMoveBegin,
    onMoveEnd,
    onLayout,
    onDelete,
    metrics,
  }: Props & { metrics: TagRenderingMetrics }) => {
    const { id, name, x, y, selected, style: tagStyle } = tag;

    const [cw] = useSharedValueFrom(canvasWidth);
    const [ch] = useSharedValueFrom(canvasHeight);

    const stroke = tagStyle?.stroke ?? DefaultAnnotationTagStyle.stroke;
    const fill = tagStyle?.fill ?? DefaultAnnotationTagStyle.fill;
    const textFill = tagStyle?.textFill ?? DefaultAnnotationTagStyle.textFill;

    // the current accumulated translation of the tag view, which is
    // updated while moving the tag view around.
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    // tracks the stacking order of the this tag view.
    const zIndex = useSharedValue(0);

    // the width and height of the tag view
    const width = useSharedValue(0);
    const height = useSharedValue(0);

    // the anchor point inside the tag view, which decides
    // how the tag view is positioned relative to the touch point.
    // currently, the anchor point is made at center of outline circle
    const anchorX = useSharedValue(metrics.anchorPoint.x);
    const anchorY = useSharedValue(metrics.anchorPoint.y);

    // on first render, tell tag manager to record the interaction
    // information of this tag view so that the manager can adjust
    // the stacking order, etc. at a higher level.
    useEffect(() => {
      onReady?.(id, { translateX, translateY, zIndex });
    }, [id, onReady, translateX, translateY, zIndex]);

    const left = useDerivedValue(() => x + translateX.value - anchorX.value);
    const top = useDerivedValue(() => y + translateY.value - anchorY.value);

    const animatedStyle = useAnimatedStyle(() => {
      // if (!isReady) return {};
      return {
        zIndex: zIndex.value,
        transform: [
          {
            // translateX: x + translateX.value - anchorX.value,
            translateX: left.value,
          },
          {
            // translateY: y + translateY.value - anchorY.value,
            translateY: top.value,
          },
        ],
      };
    });

    const onTagMoveBegin = useCallback(
      (tx: number, ty: number) => {
        onMoveBegin?.(id, tx, ty);
      },
      [id, onMoveBegin],
    );

    const onTagMoveEnd = useCallback(
      (tx: number, ty: number) => {
        onMoveEnd?.(id, tx, ty);
      },
      [id, onMoveEnd],
    );

    // console.log('metrics: ', metrics);
    const startX = useSharedValue(0);
    const startY = useSharedValue(0);

    const pan = Gesture.Pan()
      .onBegin(e => {
        startX.value = e.x;
        startY.value = e.y;
        runOnJS(onTagMoveBegin)(e.x, e.y);
      })
      .onUpdate(e => {
        const offsetX = e.x - startX.value;
        const offsetY = e.y - startY.value;

        const tx = translateX.value + offsetX;
        const ty = translateY.value + offsetY;

        // clamp translation to keep the view in canvas bounds based on fomular:
        //  x + tx - ax >= 0           (1)
        //  x + tx - ax <= cw - w      (2)
        translateX.value = Math.min(
          Math.max(tx, anchorX.value - x),
          cw.value - width.value - x + anchorX.value,
        );
        translateY.value = Math.min(
          Math.max(ty, anchorY.value - y),
          ch.value - height.value - y + anchorY.value,
        );
      })
      .onEnd(e => {
        startX.value = 0;
        startY.value = 0;
        runOnJS(onTagMoveEnd)(e.x, e.y);
      });

    const onTagPress = useCallback(() => {
      onPress?.(id);
    }, [id, onPress]);

    const onDeletePress = useCallback(() => {
      onDelete?.(id);
    }, [id, onDelete]);

    const onLayoutChange = useCallback(
      (e: LayoutChangeEvent) => {
        if (!metrics) return null;
        width.value = e.nativeEvent.layout.width;
        height.value = e.nativeEvent.layout.height;
        onLayout?.(id, {
          x,
          y,
          width: e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
        });
      },
      [width, height, id, metrics, onLayout, x, y],
    );

    return (
      <GestureDetector gesture={pan}>
        <Animated.View
          css={`
            position: absolute;
            left: 0px;
            top: 0px;
            border-width: 1px;
            border-style: dashed;
            border-color: ${selected ? '#fff' : 'transparent'};
          `}
          style={[style, animatedStyle]}
        >
          <TouchableOpacity onPress={onTagPress} activeOpacity={0.9}>
            {metrics != null && (
              <Svg
                width={metrics.width}
                height={metrics.height}
                onLayout={onLayoutChange}
              >
                {/** outline circle */}
                <Circle
                  cx={metrics.outlineCircle.cx}
                  cy={metrics.outlineCircle.cy}
                  r={metrics.outlineCircle.r}
                  strokeWidth={kOutlineCircleStrokeWidth}
                  stroke={stroke}
                  fill="none"
                />
                {/** inner filled circle */}
                <Circle
                  cx={metrics.solidCircle.cx}
                  cy={metrics.solidCircle.cy}
                  r={metrics.solidCircle.r}
                  stroke="none"
                  fill={stroke}
                />
                {/** connector */}
                <Path
                  d={connectorToPathString(metrics.connector)}
                  strokeWidth={kConnectorStrokeWidth}
                  stroke={stroke}
                />
                {/** text box */}
                <Rect
                  x={metrics.textBox.x}
                  y={metrics.textBox.y}
                  width={metrics.textBox.w}
                  height={metrics.textBox.h}
                  rx={metrics.textBox.rx}
                  ry={metrics.textBox.ry}
                  strokeWidth={kTextBorderStrokeWidth}
                  stroke={stroke}
                  fill={fill}
                />
                {/** text */}
                <ForeignObject
                  x={metrics.text.x}
                  y={metrics.text.y}
                  width={metrics.text.w}
                  height={metrics.text.h}
                  // https://github.com/react-native-svg/react-native-svg/issues/1357
                  // foreign object does not update, add a key to workaround
                  key={textFill}
                >
                  <Text
                    css={`
                      font-family: ${DefaultTagFontFamily};
                      font-size: ${kDefaultFontSize}px;
                      max-width: ${kMaxWidth}px;
                      color: ${textFill};
                    `}
                    numberOfLines={0}
                  >
                    {name}
                  </Text>
                </ForeignObject>
              </Svg>
            )}
          </TouchableOpacity>
          {selected && (
            <TouchableOpacity
              onPress={onDeletePress}
              css={`
                position: absolute;
                right: -8px;
                top: -8px;
                width: 16px;
                height: 16px;
                border-radius: 8px;
                background-color: ${StatusColors.Danger};
                align-items: center;
                justify-content: center;
              `}
              hitSlop={PredefinedHitSlops.medium}
            >
              <AntDesign name="close" size={10} color="#fff" />
            </TouchableOpacity>
          )}
        </Animated.View>
      </GestureDetector>
    );
  },
);

const deg2rad_factor = Math.PI / 180.0;
const deg2rad = (x: number) => x * deg2rad_factor;

const connectorToPathString = (path: Path2D) => {
  const [p0, ...points] = path;
  return [`M${p0.x},${p0.y}`, ...points.map(p => `L${p.x},${p.y}`)].join(' ');
};

const useTagRenderingMetrics = (
  textMetrics:
    | {
        width: number;
        height: number;
      }
    | undefined,
) => {
  return useMemo(() => {
    if (textMetrics?.width == null || textMetrics?.height == null) {
      return null;
    }

    const [textBoxWidth, textBoxHeight] = [
      textMetrics.width + 2 * kTextBoxPadding[0],
      textMetrics.height + 2 * kTextBoxPadding[1],
    ];

    const angle = deg2rad(kConnectorStartAngle);

    // the offset of the connector line start point relative to the center
    // of the solid inner circle.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [connectorStartPointOffsetX, connectorStartPointOffsetY] = [
      kSolidCircleRadius * Math.cos(angle),
      kSolidCircleRadius * Math.sin(angle),
    ];

    const height =
      kOutlineCircleStrokeWidth +
      kOutlineCircleRadius +
      connectorStartPointOffsetY +
      kTextBoxOffsetY +
      textBoxHeight +
      2 * kTextBorderStrokeWidth;

    const [cx, cy] = [
      kOutlineCircleRadius + kOutlineCircleStrokeWidth,
      height - kOutlineCircleRadius - kOutlineCircleStrokeWidth,
    ];

    const py0 =
      cy -
      connectorStartPointOffsetY +
      kTextBorderStrokeWidth -
      textBoxHeight / 2;

    const p1: Point2D = {
      x: cx,
      y: cy,
    };
    const p2: Point2D = {
      x: (cy - py0) / Math.tan(angle),
      y: py0,
    };
    const p3: Point2D = {
      x: p2.x + kConnectorEndWidth,
      y: py0,
    };

    // width and height of the tag shape
    const width = p3.x + textBoxWidth + 2 * kTextBorderStrokeWidth * 2;

    const textBox: Rect2D = {
      x: p3.x + kTextBorderStrokeWidth,
      y: p3.y - textBoxHeight / 2 - kTextBoxOffsetY - kTextBorderStrokeWidth,
      w: textBoxWidth + kTextBorderStrokeWidth,
      h: textBoxHeight + kTextBorderStrokeWidth,
      rx: textBoxHeight / 2,
      ry: textBoxHeight / 2,
    };

    const text: Text2D = {
      x: textBox.x + kTextBoxPadding[0],
      y: textBox.y + kTextBoxPadding[1],
      w: textMetrics.width,
      h: textMetrics.height,
    };

    const metrics: TagRenderingMetrics = {
      width,
      height,
      solidCircle: {
        cx,
        cy,
        r: kSolidCircleRadius,
      },
      outlineCircle: {
        cx,
        cy,
        r: kOutlineCircleRadius,
      },
      connector: [p1, p2, p3],
      textBox,
      text,
      anchorPoint: {
        x: cx,
        y: cy,
      },
    };

    return metrics;
  }, [textMetrics?.width, textMetrics?.height]);
};
