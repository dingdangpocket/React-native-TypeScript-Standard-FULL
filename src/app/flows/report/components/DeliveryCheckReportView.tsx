import { useContainerLayout } from '@euler/app/components/layout/LayoutProvider';
import { MediaCarousel } from '@euler/app/components/media/MediaCarousel';
import {
  DeliveryCheckCellModel,
  useDeliveryCheckReportModels,
} from '@euler/app/flows/report/functions/useDeliveryCheckReportModels';
import { Center, Colors } from '@euler/components';
import { FontFamily } from '@euler/components/typography';
import { VehicleReport } from '@euler/model/report';
import { MaterialIcons } from '@expo/vector-icons';
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

export const DeliveryCheckReportView = memo(
  ({ report }: { report: VehicleReport }) => {
    const { cells } = useDeliveryCheckReportModels(report);
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
    model: DeliveryCheckCellModel;
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
            flex: 1;
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
              font-size: 18px;
            `}
          >
            {model.title}
          </Text>
        </Text>
        <View
          css={`
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
          `}
        >
          <Text
            css={`
              font-family: ${FontFamily.NotoSans.Light};
              font-size: 14px;
              color: ${Colors.Gray3};
            `}
          >
            检查人: {model.technicianName}
          </Text>
          <Animated.View
            style={caretStyle}
            css={`
              top: 1px;
            `}
          >
            <MaterialIcons
              name="keyboard-arrow-up"
              size={32}
              color={theme.report.construction.section.header.titleColor}
            />
          </Animated.View>
        </View>
      </TouchableOpacity>
    );
  },
);

const kSectionContentSpacing = 15;

const CellContent = memo(
  ({
    model,
    progress,
    ...props
  }: {
    model: DeliveryCheckCellModel;
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
      <Animated.View
        onLayout={onLayout}
        css={`
          overflow: hidden;
        `}
        style={contentHeight ? contentStyle : null}
        {...props}
      >
        <MediaCarousel
          medias={model.medias}
          css={`
            width: ${contentWidth}px;
            height: ${mediaHeight}px;
            border-radius: 3px;
            overflow: hidden;
            margin-top: 10px;
          `}
        />
        <View
          css={`
            flex-direction: row;
            align-items: flex-start;
            justify-content: flex-start;
            margin-top: 10px;
          `}
        >
          <Center
            css={`
              background-color: ${theme.colors.status.success};
              margin-right: 4px;
              padding: 0 4px;
              border-radius: 3px;
            `}
          >
            <Text
              css={`
                font-family: ${FontFamily.NotoSans.Light};
                font-size: 12px;
                text-align: center;
                color: #fff;
                line-height: 16px;
              `}
            >
              备注
            </Text>
          </Center>
          <Text
            css={`
              font-family: ${FontFamily.NotoSans.Light};
              font-size: 14px;
              text-align: center;
              margin-right: 4px;
              line-height: 18px;
              color: ${Colors.Gray2};
            `}
          >
            {model.remark}
          </Text>
        </View>
      </Animated.View>
    );
  },
);

const Cell = memo(({ model }: { model: DeliveryCheckCellModel }) => {
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
