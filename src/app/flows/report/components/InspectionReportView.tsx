import { useContainerLayout } from '@euler/app/components/layout/LayoutProvider';
import { MediaCarousel } from '@euler/app/components/media/MediaCarousel';
import { ScoreGaugeView } from '@euler/app/components/score/ScoreGauge';
import { DefectiveLabel } from '@euler/app/flows/report/components/DefectiveLabel';
import {
  CellModel,
  CellType,
  useInspectionReportModels,
} from '@euler/app/flows/report/functions';
import { Colors } from '@euler/components';
import { FontFamily } from '@euler/components/typography';
import {
  getDefectiveLevelBgColor,
  getDefectiveLevelColor,
  getDefectiveLevelTextShort,
} from '@euler/functions';
import { VehicleReport } from '@euler/model/report';
import { assertNever } from '@euler/utils';
import { MaterialIcons } from '@expo/vector-icons';
import { memo, ReactElement, useCallback, useRef, useState } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  ListRenderItemInfo,
  ScrollView,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from 'styled-components';

const kUseFlatList = true;

export const InspectionReportView = memo(
  ({ report }: { report: VehicleReport }) => {
    const { cells } = useInspectionReportModels(report);
    if (kUseFlatList) {
      return (
        <FlatList
          data={cells}
          keyExtractor={x => x.id}
          renderItem={renderCell}
        />
      );
    }
    return (
      <ScrollView>{cells.map(item => renderCell({ item } as any))}</ScrollView>
    );
  },
);

function renderCell({
  item,
}: ListRenderItemInfo<CellModel>): ReactElement | null {
  const type = item.type;

  switch (type) {
    case 'score':
      return (
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        <ScoreCell score={item.score} key={item.id} />
      );

    case 'group-header':
      return (
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        <GroupHeaderCell model={item} key={item.id} />
      );

    case 'section':
      return (
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        <SectionCell model={item} key={item.id} />
      );

    default:
      assertNever(type);
  }
}

const ScoreCell = memo(({ score }: { score: number }) => {
  const { width } = useContainerLayout();
  return (
    <View
      css={`
        background-color: #fff;
        padding: 15px;
        margin-top: 10px;
      `}
    >
      <ScoreGaugeView
        score={score}
        css={`
          align-self: stretch;
          width: ${width - 30}px;
          height: ${width - 30}px;
        `}
      />
    </View>
  );
});

const GroupHeaderCell = memo(
  ({ model }: { model: CellType<'group-header'> }) => {
    const theme = useTheme();
    const color = getDefectiveLevelColor(theme, model.defectiveLevel);
    return (
      <View
        css={`
          padding: 15px;
          background-color: #fff;
          margin-top: 15px;
        `}
      >
        <View
          css={`
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <Text
            css={`
              font-family: ${FontFamily.NotoSans.Medium};
              font-size: 16px;
              color: ${color};
            `}
          >
            {model.title}
          </Text>
          <Text
            css={`
              font-family: ${FontFamily.NotoSans.Regular};
              font-size: 16px;
              color: ${color};
            `}
          >
            {model.count}项
          </Text>
        </View>
        <Text
          numberOfLines={0}
          css={`
            font-family: ${FontFamily.NotoSans.Light};
            font-size: 14px;
            color: ${Colors.Gray2};
            line-height: 18px;
            margin-top: 10px;
          `}
        >
          {model.description}
        </Text>
      </View>
    );
  },
);

const Triangle = memo(
  ({
    height,
    color,
    style,
  }: {
    height: number;
    color: string;
    style?: StyleProp<ViewStyle>;
  }) => {
    const width = (height / 2) * Math.tan(Math.PI / 4.5);
    const d = ['M0,0', `L0,${height}`, `L${width},${height / 2}`, 'Z'].join(
      ' ',
    );
    return (
      <Svg
        css={`
          height: ${height}px;
          width: ${width}px;
          flex-shrink: 0;
          flex-grow: 0;
        `}
        viewBox={`0 0 ${width} ${height}`}
        style={style}
      >
        <Path d={d} fill={color} />
      </Svg>
    );
  },
);

const kSectionContentSpacing = 15;
const kSectionMargin = 15;

const SectionHeader = memo(
  ({
    model,
    color,
    progress,
    onPress,
  }: {
    model: CellType<'section'>;
    color: string;
    progress: SharedValue<number>;
    onPress: () => void;
  }) => {
    const caretStyle = useAnimatedStyle(() => {
      const angle = interpolate(progress.value, [0, 1], [180, 0]);
      return {
        transform: [
          {
            rotate: `${angle}deg`,
          },
        ],
      };
    });

    return (
      <TouchableOpacity
        onPress={onPress}
        css={`
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        `}
        hitSlop={{ left: 0, right: 0, top: 8, bottom: 8 }}
      >
        <Text
          css={`
            color: ${color};
            left: -3px;
          `}
        >
          <Text
            css={`
              font-weight: bold;
              font-style: italic;
              font-size: 28px;
            `}
          >
            {model.index + 1}.{' '}
          </Text>
          <Text
            css={`
              font-family: ${FontFamily.NotoSans.Regular};
              font-size: 16px;
              color: ${color};
            `}
          >
            {model.title}
          </Text>
        </Text>
        <Animated.View
          style={caretStyle}
          css={`
            top: 3px;
          `}
        >
          <MaterialIcons name="keyboard-arrow-up" size={24} color={color} />
        </Animated.View>
      </TouchableOpacity>
    );
  },
);

const SectionContent = memo(
  ({
    model,
    color,
    progress,
    ...props
  }: {
    model: CellType<'section'>;
    color: string;
    progress: SharedValue<number>;
  } & ViewProps) => {
    const { width: containerWidth } = useContainerLayout();
    const [contentHeight, setContentHeight] = useState<number>();

    const contentWidth =
      containerWidth - kSectionMargin * 2 - kSectionContentSpacing * 2;
    const mediaHeight = contentWidth * 0.75;

    const contentStyle = useAnimatedStyle(() => {
      if (contentHeight == null) return {};
      const height = interpolate(progress.value, [0, 1], [0, contentHeight]);
      return { height };
    });

    const onLayout = useCallback(
      (e: LayoutChangeEvent) => {
        if (contentHeight == null) {
          setContentHeight(e.nativeEvent.layout.height);
        }
      },
      [contentHeight],
    );

    return (
      <Animated.View
        onLayout={onLayout}
        css={`
          overflow: hidden;
        `}
        style={contentHeight ? contentStyle : null}
        {...props}
      >
        {model.medias.length ? (
          <MediaCarousel
            medias={model.medias}
            css={`
              width: ${contentWidth}px;
              height: ${mediaHeight}px;
              margin-top: 10px;
            `}
          />
        ) : null}
        {model.items.map((item, index) => (
          <View
            key={index}
            css={`
              flex-direction: row;
              flex-wrap: nowrap;
              align-items: flex-start;
              justify-content: space-between;
              padding-top: 10px;
              padding-bottom: 10px;
            `}
          >
            <Triangle
              height={12}
              color={color}
              css={`
                top: 5px;
              `}
            />
            <View
              css={`
                flex: 1;
                margin-left: 4px;
              `}
            >
              <View
                css={`
                  flex-direction: row;
                  align-items: center;
                `}
              >
                <View
                  css={`
                    flex: 1;
                  `}
                >
                  <Text numberOfLines={0}>
                    <Text
                      css={`
                        font-family: ${FontFamily.NotoSans.Regular};
                        font-size: 14px;
                        color: #000;
                      `}
                    >
                      {item.name}
                    </Text>
                    <Text
                      css={`
                        font-family: ${FontFamily.NotoSans.Regular};
                        font-size: 14px;
                        color: ${color};
                      `}
                    >
                      {' '}
                      {item.label}
                    </Text>
                  </Text>
                </View>
                <DefectiveLabel
                  color={color}
                  text={getDefectiveLevelTextShort(item.defectiveLevel)}
                />
              </View>
              {item.description && (
                <View
                  css={`
                    margin-top: 3px;
                  `}
                >
                  <Text
                    css={`
                      font-family: ${FontFamily.NotoSans.Light};
                      font-size: 12px;
                      color: ${Colors.Gray2};
                    `}
                  >
                    {item.description}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </Animated.View>
    );
  },
);

const SectionCell = memo(({ model }: { model: CellType<'section'> }) => {
  const theme = useTheme();

  const color = getDefectiveLevelColor(theme, model.defectiveLevel);
  const bgColor = getDefectiveLevelBgColor(theme, model.defectiveLevel);

  const progress = useSharedValue(1);
  const isCollapsing = useRef(false);

  const onHeaderPress = useCallback(() => {
    if (progress.value > 0 && !isCollapsing.current) {
      // collapse
      isCollapsing.current = true;
      progress.value = withTiming(0, {
        duration: 150,
        easing: Easing.inOut(Easing.linear),
      });
    } else {
      isCollapsing.current = false;
      progress.value = withTiming(1, {
        duration: 150,
        easing: Easing.inOut(Easing.linear),
      });
    }
  }, [progress]);

  return (
    <View
      css={`
        margin-left: ${kSectionMargin}px;
        margin-right: ${kSectionMargin}px;
        margin-top: ${kSectionMargin}px;
        background-color: ${bgColor};
        padding: ${kSectionContentSpacing}px;
        border-radius: 5px;
        padding-top: 5px;
        padding-bottom: 10px;
      `}
    >
      <SectionHeader
        model={model}
        color={color}
        progress={progress}
        onPress={onHeaderPress}
      />
      <SectionContent model={model} color={color} progress={progress} />
    </View>
  );
});
