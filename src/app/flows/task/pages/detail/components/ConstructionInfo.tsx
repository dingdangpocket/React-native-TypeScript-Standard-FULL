/* eslint-disable @typescript-eslint/no-use-before-define */
import { LinkButton } from '@euler/app/components/LinkButton';
import { SuspenseContent } from '@euler/app/components/SuspenseContent';
import { StatusLabel } from '@euler/app/flows/task/components/StatusLabel';
import {
  constructionJobStatusToTaskStatus,
  getConstructionJobsResourceId,
} from '@euler/app/flows/task/functions';
import { TableView } from '@euler/components/TableView';
import { Label } from '@euler/components/typography/Label';
import { CommonTaskStatus } from '@euler/model/enum';
import { Construction } from '@euler/model/task-detail';
import { timeUtilNow } from '@euler/utils/formatters';
import { AntDesign } from '@expo/vector-icons';
import { memo } from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { TaskCard } from './TaskCard';

export const ConstructionInfo = memo(
  ({ taskNo, detail }: { taskNo: string; detail: Construction }) => {
    const resourceId = getConstructionJobsResourceId(taskNo);

    return (
      <TaskCard
        title="维保施工"
        headerRight={
          detail.status === CommonTaskStatus.Finished ? '查看报告' : undefined
        }
        onHeaderRightPress={() => null}
        bodyStyle={{
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <SuspenseContent resourceId={resourceId}>
          <Content detail={detail} />
        </SuspenseContent>
      </TaskCard>
    );
  },
);

export const Content = memo(({ detail }: { detail: Construction }) => {
  const theme = useTheme();
  return (
    <TableView>
      {detail.jobs.map(job => (
        <TableView.Item
          key={job.id}
          title={job.name}
          titleStyle={{ fontSize: 16, marginBottom: 5 }}
          note={
            <>
              {job.remark ? <Label>{job.remark}</Label> : null}
              <View
                css={`
                  flex-direction: row;
                  align-items: center;
                `}
              >
                <Label
                  light
                  size={12}
                  color={t => t.components.table.item.noteColor}
                >
                  施工技师:
                </Label>
                <Label
                  light
                  size={12}
                  color={t => t.components.table.item.noteColor}
                >
                  {job.technicianName ?? '未知'}
                </Label>
              </View>
            </>
          }
          noteStyle={{ fontSize: 12 }}
          iconStyle={{ marginRight: 10 }}
          detailIcon="disclosure"
          css={`
            padding: 15px 0;
            min-height: 74px;
          `}
          detail={
            <>
              <Label light size={13} color="#555">
                {timeUtilNow(
                  job.finishedAt ??
                    job.updatedAt ??
                    job.createdAt ??
                    new Date(),
                )}
              </Label>
              <StatusLabel
                status={constructionJobStatusToTaskStatus(job.status)}
                continuable
                css={`
                  margin-left: 5px;
                `}
              />
            </>
          }
        />
      ))}
      {detail.jobs.length === 0 ? (
        <TableView.Item>
          <Label light color={p => p.form.label.color} size={14}>
            施工未开始，点击添加施工任务
          </Label>
        </TableView.Item>
      ) : null}
      {detail.status !== CommonTaskStatus.Finished ? (
        <TableView.Item
          contentContainerStyle={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <LinkButton text="添加施工任务" />
          <AntDesign
            name="pluscircleo"
            size={16}
            color={theme.link}
            css={`
              margin-left: 5px;
            `}
          />
        </TableView.Item>
      ) : null}
    </TableView>
  );
});
