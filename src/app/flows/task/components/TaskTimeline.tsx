import {
  LayoutProviderView,
  useContainerLayout,
} from '@euler/app/components/layout/LayoutProvider';
import { MediaCarousel } from '@euler/app/components/media/MediaCarousel';
import {
  buildTimeline,
  TimelineCell,
  useTaskTimeline,
  useTaskTimelineModels,
} from '@euler/app/flows/task/functions/timeline';
import {
  TextLine,
  TimelineSectionType,
} from '@euler/app/flows/task/functions/timeline/types';
import { AppNavParams, ReportNavParams } from '@euler/app/Routes';
import { Colors, StatusColors } from '@euler/components';
import { EmptyView } from '@euler/components/EmptyView';
import { FontFamily } from '@euler/components/typography';
import { AttributedText } from '@euler/model/AttributedText';
import { formatDateTime } from '@euler/utils/formatters';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FC, memo, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleProp,
  Text,
  TextProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { useTheme } from 'styled-components/native';

const kSectionLineHeight = 44;
const kSectionConnectorWidth = 18;
const kSectionConnectorLeftMargin = 0;
const kSectionConnectorRightMargin = 8;
const kSectionConnectorRadius = 5;

const kEventConnectorWidth = 12;
const kEventConnectorLineHeight = 30;
const kEventConnectorLeftMargin = 8;
const kEventConnectorRightMargin = 8;
const kEventConnectorRadius = 3;

const kTechnicianNameWidth = 50;
const kCellHorizontalPadding = 15;
const kConnectorLineDotSpace = 3;

export function isArray<T>(array: T | T[]): array is T[] {
  return Array.isArray(array);
}

const kLogConnector = false;

const Connector = memo(
  ({
    first,
    last,
    width,
    lineHeight,
    radius,
    spacer = kConnectorLineDotSpace,
    strokeColor = '#ddd',
    fillColor = StatusColors.Info,
    lineOnly,
    style,
    hint,
    lineHidden,
    ...props
  }: {
    first?: boolean;
    last?: boolean;
    width: number;
    height: number;
    lineHeight: number;
    radius: number;
    spacer?: number;
    strokeColor?: string;
    fillColor?: string;
    lineOnly?: boolean;
    style?: StyleProp<ViewStyle>;
    hint?: string;
    lineHidden?: boolean;
  }) => {
    const height = Math.ceil(props.height ?? 24);
    const dy = spacer;
    const cx = width / 2;
    const cy = lineHeight / 2;
    kLogConnector &&
      console.log(`[${hint ?? '?'}] connector props: `, {
        lineOnly,
        width,
        height,
        radius,
        dy,
        cx,
        cy,
      });
    return (
      <Svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        css={`
          flex-grow: 0;
          flex-shrink: 0;
        `}
        style={style}
      >
        {!first && !lineOnly && (
          <Line
            x1={cx}
            y1={0}
            x2={cx}
            y2={cy - radius - dy}
            stroke={strokeColor}
          />
        )}
        {!last && !lineOnly && (
          <Line
            x1={cx}
            y1={cy + radius + dy}
            x2={cx}
            y2={height}
            stroke={strokeColor}
          />
        )}
        {!lineOnly && <Circle cx={cx} cy={cy} r={radius} fill={fillColor} />}
        {lineOnly && (
          <Line
            x1={cx}
            y1={0}
            x2={cx}
            y2={height}
            stroke={lineHidden ? 'transparent' : strokeColor}
          />
        )}
      </Svg>
    );
  },
);

const TextSegment = memo(
  ({ segment }: { segment: string | AttributedText }) => {
    const theme = useTheme();
    return (
      <Text
        style={
          typeof segment === 'string'
            ? undefined
            : {
                fontFamily: segment.fontFamily,
                fontSize: segment.fontSize,
                color:
                  typeof segment.color === 'string'
                    ? segment.color
                    : segment.color?.(theme),
              }
        }
      >
        {typeof segment === 'string' ? segment : segment.text}
      </Text>
    );
  },
);

const Tagline = memo(
  ({ tagline, ...props }: { tagline: TextLine } & TextProps) => {
    return (
      <Text {...props}>
        {typeof tagline === 'string' ? (
          tagline
        ) : isArray(tagline) ? (
          tagline.map((segment, k) => <TextSegment key={k} segment={segment} />)
        ) : (
          <TextSegment segment={tagline} />
        )}
      </Text>
    );
  },
);

const Cell = memo(
  ({
    model,
    width,
    headerTextStyle,
    onPressSectionHeader,
  }: {
    model: TimelineCell;
    width: number;
    headerTextStyle?: StyleProp<TextStyle>;
    onPressSectionHeader?: (section: TimelineSectionType) => void;
  }) => {
    if (model.type === 'section-header') {
      return (
        <LayoutProviderView
          fallbackToChildren
          css={`
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 0 ${kCellHorizontalPadding}px;
            overflow: hidden;
          `}
        >
          {size => (
            <>
              <Connector
                first={model.first}
                last={model.last}
                width={kSectionConnectorWidth}
                height={Math.round(size.height)}
                lineHeight={kSectionLineHeight}
                radius={kSectionConnectorRadius}
                css={`
                  margin-left: ${kSectionConnectorLeftMargin}px;
                  margin-right: ${kSectionConnectorRightMargin}px;
                `}
              />
              <View
                css={`
                  flex: 1;
                  border-bottom-width: 1px;
                  border-bottom-color: #ddd;
                  flex-direction: row;
                  align-items: center;
                  justify-content: space-between;
                  height: ${kSectionLineHeight}px;
                `}
              >
                <Text
                  css={`
                    flex: 1;
                    font-family: ${FontFamily.NotoSans.Medium};
                    font-size: 18px;
                    line-height: ${kSectionLineHeight}px;
                  `}
                  style={headerTextStyle}
                >
                  {model.title}
                </Text>
                {onPressSectionHeader ? (
                  <TouchableOpacity
                    onPress={() => onPressSectionHeader(model.sectionType)}
                  >
                    <Text
                      css={`
                        color: ${Colors.Green2};
                        font-family: ${FontFamily.NotoSans.Light};
                        font-size: 12px;
                      `}
                    >
                      查看报告
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </>
          )}
        </LayoutProviderView>
      );
    } else {
      const mediaListWidth =
        width -
        (kSectionConnectorWidth +
          kSectionConnectorLeftMargin +
          kSectionConnectorRightMargin) -
        kTechnicianNameWidth -
        (kEventConnectorWidth +
          kEventConnectorLeftMargin +
          kEventConnectorRightMargin) -
        kCellHorizontalPadding * 2;

      return (
        <LayoutProviderView
          css={`
            flex-direction: row;
            align-items: stretch;
            justify-content: flex-start;
            padding: 0 ${kCellHorizontalPadding}px;
            overflow: hidden;
          `}
        >
          {size => (
            <>
              <Connector
                lineOnly
                lineHidden={model.lastSection}
                width={kSectionConnectorWidth}
                height={Math.round(size.height)}
                lineHeight={kEventConnectorLineHeight}
                radius={0}
                css={`
                  margin-left: ${kSectionConnectorLeftMargin}px;
                  margin-right: ${kSectionConnectorRightMargin}px;
                `}
              />
              <View>
                <Text
                  numberOfLines={1}
                  css={`
                    width: ${kTechnicianNameWidth}px;
                    flex-grow: 0;
                    flex-shrink: 0;
                    line-height: ${kEventConnectorLineHeight}px;
                    font-family: ${FontFamily.NotoSans.Light};
                    font-size: 12px;
                    color: ${Colors.Gray2};
                  `}
                >
                  {model.technicianName}
                </Text>
              </View>
              <Connector
                first={model.first}
                last={model.last}
                width={kEventConnectorWidth}
                height={Math.round(size.height)}
                lineHeight={kEventConnectorLineHeight}
                radius={kEventConnectorRadius}
                css={`
                  margin-left: ${kEventConnectorLeftMargin}px;
                  margin-right: ${kEventConnectorRightMargin}px;
                `}
              />
              <View
                css={`
                  flex: 1;
                `}
              >
                <Tagline
                  tagline={model.title}
                  css={`
                    line-height: ${kEventConnectorLineHeight}px;
                    font-family: ${FontFamily.NotoSans.Light};
                    font-size: 13px;
                  `}
                />
                {model.taglines?.map((tagline, i) => (
                  <Tagline
                    key={i}
                    tagline={tagline}
                    css={`
                      line-height: 18px;
                      font-family: ${FontFamily.NotoSans.Light};
                      font-size: 12px;
                      margin-bottom: 4px;
                    `}
                  />
                ))}
                <Text
                  numberOfLines={1}
                  css={`
                    line-height: 16px;
                    margin-bottom: 8px;
                    font-family: ${FontFamily.NotoSans.Light};
                    font-size: 12px;
                    color: ${Colors.Gray3};
                  `}
                >
                  {formatDateTime(model.timestamp)}
                  {'/'}
                  {model.id}
                </Text>
                <MediaCarousel
                  display="list"
                  listKey={model.id}
                  numberOfItemsPerRow={4}
                  itemSpacer={6}
                  medias={model.medias ?? []}
                  listWidth={mediaListWidth}
                  itemStyle={{
                    borderRadius: 5,
                    overflow: 'hidden',
                    marginBottom: 5,
                  }}
                  playIconSize={24}
                  css={`
                    margin-top: -8px;
                    margin-bottom: 10px;
                  `}
                />
              </View>
            </>
          )}
        </LayoutProviderView>
      );
    }
  },
);

const SectionToScreenMap: Record<
  Exclude<TimelineSectionType, 'none' | 'quotation' | 'order'>,
  keyof ReportNavParams
> = {
  'pre-inspection': 'PreInspectionReport',
  inspection: 'InspectionReport',
  construction: 'ConsturctionReport',
  'delivery-check': 'DeliveryCheckReport',
};

export const TaskTimeline: FC<{
  taskNo: string;
}> = memo(({ taskNo }) => {
  const { loading, data, error, refresh } = useTaskTimeline(taskNo);
  const sections = buildTimeline(taskNo, data ?? []);
  const { width } = useContainerLayout();
  const navigation = useNavigation<StackNavigationProp<AppNavParams>>();
  const onPressSectionHeader = useCallback(
    (section: TimelineSectionType) => {
      switch (section) {
        case 'order':
          navigation.navigate('Task', { taskNo });
          break;
        case 'quotation':
        case 'none':
          break;
        default: {
          const screen = SectionToScreenMap[section];
          navigation.navigate(screen, { taskNo });
          break;
        }
      }
    },
    [navigation, taskNo],
  );
  const { cells } = useTaskTimelineModels({ sections, onPressSectionHeader });

  if (!data || !data.length) {
    return (
      <ScrollView
        css={`
          flex: 1;
        `}
        contentContainerStyle={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!data && loading ? (
          <ActivityIndicator color={Colors.Gray2} />
        ) : !data && error ? (
          <EmptyView
            error={error}
            message={__DEV__ ? error.message : '获取工作记录失败, 请稍候重试'}
            onRetry={refresh}
          />
        ) : (
          <EmptyView message="暂无相关报告数据" onRetry={refresh} />
        )}
      </ScrollView>
    );
  }

  return (
    <FlatList
      data={cells}
      keyExtractor={x => x.id}
      initialNumToRender={20}
      renderItem={({ item }) => (
        <Cell
          model={item}
          onPressSectionHeader={onPressSectionHeader}
          width={width}
        />
      )}
    />
  );
});

export const TaskTimelineCell = Cell;
