/**
 * @file: PreInspectionInfo.tsx
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { StatusLabel } from '@euler/app/flows/task/components/StatusLabel';
import { TaskCard } from '@euler/app/flows/task/pages/detail/components/TaskCard';
import { TableView } from '@euler/components/TableView';
import { Label } from '@euler/components/typography/Label';
import { CommonTaskStatus } from '@euler/model/enum';
import { PreInspection } from '@euler/model/task-detail';
import { timeUtilNow } from '@euler/utils/formatters';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { memo, useCallback } from 'react';

export const PreInspectionInfo = memo(
  ({
    taskNo,
    serviceAgentName,
    detail,
  }: {
    taskNo: string;
    serviceAgentName: string;
    detail: PreInspection;
  }) => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const onPress = useCallback(() => {
      if (detail.status === CommonTaskStatus.Pending) {
        navigation.navigate('PreInspectionComfirm', {
          taskDetail: detail,
          taskNo,
        });
      } else if (detail.status === CommonTaskStatus.InProgress) {
        navigation.navigate('PreInspection', { taskDetail: detail, taskNo });
      } else if (detail.status === CommonTaskStatus.Finished) {
        navigation.navigate('PreinspectionReportPreview', {
          taskDetail: detail,
          taskNo,
        });
      }
    }, [navigation, detail, taskNo]);
    return (
      <TaskCard
        title="接车预检"
        headerRight={
          detail.status === CommonTaskStatus.Finished ? '查看报告' : undefined
        }
        onHeaderRightPress={onPress}
        bodyStyle={{
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <TableView>
          <TableView.Item
            onPress={onPress}
            title={
              detail.status === CommonTaskStatus.Finished
                ? `检测技师: ${detail.finishedBy ?? ''}`
                : `服务顾问: ${serviceAgentName}`
            }
            detailIcon="disclosure"
            detail={
              <>
                {detail.status === CommonTaskStatus.Finished ? (
                  <Label light size={13} color="#555">
                    {timeUtilNow(detail.finishedAt ?? new Date())}
                  </Label>
                ) : null}
                <StatusLabel
                  status={detail.status}
                  continuable
                  css={`
                    margin-left: 5px;
                  `}
                />
              </>
            }
          />
        </TableView>
      </TaskCard>
    );
  },
);
