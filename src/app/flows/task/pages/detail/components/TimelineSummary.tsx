/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  LayoutProviderView,
  useContainerLayout,
} from '@euler/app/components/layout/LayoutProvider';
import { LinkButton } from '@euler/app/components/LinkButton';
import { SuspenseContent } from '@euler/app/components/SuspenseContent';
import { TaskTimelineCell } from '@euler/app/flows/task/components/TaskTimeline';
import {
  getTimelineSummaryResourceId,
  useTaskTimelineSummary,
} from '@euler/app/flows/task/functions';
import {
  buildTimeline,
  useTaskTimelineModels,
} from '@euler/app/flows/task/functions/timeline';
import { EventInfo } from '@euler/app/flows/task/functions/timeline/types';
import { TaskCard } from '@euler/app/flows/task/pages/detail/components/TaskCard';
import { TaskNavParams } from '@euler/app/flows/task/TaskFlow';
import { FontFamily } from '@euler/components/typography';
import { dateFromValue } from '@euler/utils/datetime';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { memo, useMemo } from 'react';
import { useTheme } from 'styled-components';

export const TimelineSummary = memo(({ taskNo }: { taskNo: string }) => {
  const resourceId = getTimelineSummaryResourceId(taskNo);
  const navigation = useNavigation<StackNavigationProp<TaskNavParams>>();
  const theme = useTheme();
  return (
    <TaskCard
      title="服务进度"
      headerRight={'进度详情'}
      onHeaderRightPress={() => {
        navigation.navigate('timeline', {});
      }}
      bodyStyle={{
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      <SuspenseContent resourceId={resourceId}>
        <LayoutProviderView
          css={`
            padding-bottom: 15px;
          `}
        >
          <Content taskNo={taskNo} />
          <LinkButton
            text="查看完整进度"
            onPress={() => navigation.navigate('timeline', {})}
            css={`
              margin-top: 15px;
            `}
          >
            <SimpleLineIcons
              name="arrow-right-circle"
              size={16}
              color={theme.link}
              css={`
                margin-left: 5px;
              `}
            />
          </LinkButton>
        </LayoutProviderView>
      </SuspenseContent>
    </TaskCard>
  );
});

const Content = memo(({ taskNo }: { taskNo: string }) => {
  const [timeline] = useTaskTimelineSummary();
  const events = useMemo<EventInfo[]>(
    () =>
      timeline.map(x => ({
        id: String(x.id),
        type: x.type,
        subType: x.subType,
        timestamp: dateFromValue(x.timestamp),
        data: x.data ?? undefined,
        dataType: x.dataType,
        dataVersion: x.dataVersion ?? 0,
        author: x.author,
      })),
    [timeline],
  );
  const sections = buildTimeline(taskNo, events);
  const { cells } = useTaskTimelineModels({ sections });
  const { width } = useContainerLayout();
  return (
    <>
      {cells.map(cellModel => (
        <TaskTimelineCell
          key={cellModel.id}
          model={cellModel}
          width={width}
          headerTextStyle={{
            fontSize: 15,
            fontFamily: FontFamily.NotoSans.Light,
          }}
        />
      ))}
    </>
  );
});
