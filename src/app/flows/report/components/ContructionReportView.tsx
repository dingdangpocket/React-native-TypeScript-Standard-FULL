import { useContainerLayout } from '@euler/app/components/layout/LayoutProvider';
import { MediaCarousel } from '@euler/app/components/media/MediaCarousel';
import {
  ConstructionCellModel,
  useConstructionReportModels,
} from '@euler/app/flows/report/functions/useConstructionReportModels';
import { Colors } from '@euler/components';
import { FontFamily } from '@euler/components/typography';
import { getDefectiveLevelColor } from '@euler/functions';
import { VehicleReport } from '@euler/model/report';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { memo, useCallback, useRef, useState } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';

export const ContructionReportView = memo(
  ({ report }: { report: VehicleReport }) => {
    const { cells } = useConstructionReportModels(report);
    return (
      <FlatList
        data={cells}
        keyExtractor={x => String(x.index)}
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        renderItem={({ item }) => <Cell model={item} />}
      />
    );
  },
);

const CellHeader = memo(
  ({
    model,
    progress,
    onPress,
  }: {
    model: ConstructionCellModel;
    progress: SharedValue<number>;
    onPress: () => void;
  }) => {
    const theme = useTheme();
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
            color: ${theme.report.construction.section.header.titleColor};
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
              font-size: 19px;
            `}
          >
            {model.name}
          </Text>
        </Text>
        <Animated.View
          style={caretStyle}
          css={`
            top: 3px;
          `}
        >
          <MaterialIcons
            name="keyboard-arrow-up"
            size={32}
            color={theme.report.construction.section.header.titleColor}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  },
);

const kSectionContentSpacing = 15;
const kDotSize = 6;

const Dot = memo((props: { color: string }) => {
  return (
    <View
      css={`
        width: ${kDotSize}px;
        height: ${kDotSize}px;
        border-radius: ${kDotSize / 2}px;
        background-color: ${props.color};
      `}
    />
  );
});

const CellContent = memo(
  ({
    model,
    progress,
    ...props
  }: {
    model: ConstructionCellModel;
    progress: SharedValue<number>;
  } & ViewProps) => {
    const theme = useTheme();
    const { width: containerWidth } = useContainerLayout();
    const [contentHeight, setContentHeight] = useState<number>();

    const contentWidth = containerWidth - kSectionContentSpacing * 2;
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
      <View>
        <View
          css={`
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-top: 10px;
            margin-bottom: 10px;
          `}
        >
          <Text
            css={`
              font-family: ${FontFamily.NotoSans.Light};
              font-size: 15px;
              color: ${Colors.Gray2};
            `}
          >
            检测技师: {model.technicianName}
          </Text>
          <Text
            css={`
              font-family: ${FontFamily.NotoSans.Light};
              font-size: 13px;
              color: ${Colors.Gray2};
              text-align: right;
            `}
          >
            {model.count}项
          </Text>
        </View>
        {model.details.map((detail, i) => (
          <View
            key={i}
            css={`
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              flex-wrap: nowrap;
            `}
          >
            <Dot color={getDefectiveLevelColor(theme, detail.defectiveLevel)} />
            <Text
              css={`
                font-family: ${FontFamily.NotoSans.Light};
                font-size: 13px;
                color: ${getDefectiveLevelColor(theme, detail.defectiveLevel)};
                flex: 1;
                margin-left: 4px;
              `}
            >
              {detail.title}
            </Text>
            <View
              css={`
                flex-direction: row;
                align-items: center;
                justify-content: flex-end;
              `}
            >
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={theme.colors.status.success}
                css={`
                  top: 1px;
                `}
              />
              <Text
                css={`
                  font-family: ${FontFamily.NotoSans.Light};
                  font-size: 13px;
                  color: ${theme.colors.status.success};
                `}
              >
                已修复
              </Text>
            </View>
          </View>
        ))}
        <Animated.View
          onLayout={onLayout}
          css={`
            overflow: hidden;
          `}
          style={contentHeight ? contentStyle : null}
          {...props}
        >
          {model.procedures.map((procedure, i) => (
            <View
              key={i}
              css={`
                padding-top: 10px;
                margin-top: 10px;
              `}
            >
              <Text
                css={`
                  font-family: ${FontFamily.NotoSans.Medium};
                  font-size: 16px;
                  color: ${theme.report.construction.procedure.titleColor};
                  line-height: 20px;
                  margin-bottom: 5px;
                `}
              >
                {procedure.name}
              </Text>
              <MediaCarousel
                medias={procedure.medias}
                css={`
                  width: ${contentWidth}px;
                  height: ${mediaHeight}px;
                  border-radius: 3px;
                  overflow: hidden;
                `}
              />
            </View>
          ))}
        </Animated.View>
      </View>
    );
  },
);

const Cell = memo(({ model }: { model: ConstructionCellModel }) => {
  const theme = useTheme();
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
        padding: ${kSectionContentSpacing}px;
        margin-top: 10px;
        background-color: ${theme.section.background};
      `}
    >
      <CellHeader model={model} progress={progress} onPress={onHeaderPress} />
      <CellContent model={model} progress={progress} />
    </View>
  );
});
