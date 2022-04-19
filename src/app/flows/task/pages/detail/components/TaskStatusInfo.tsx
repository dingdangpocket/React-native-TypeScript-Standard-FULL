import { StatusLabel } from '@euler/app/flows/task/components/StatusLabel';
import { TaskNavParams } from '@euler/app/flows/task/TaskFlow';
import { AppNavParams, ReportNavParams } from '@euler/app/Routes';
import { Colors } from '@euler/components';
import { TableView } from '@euler/components/TableView';
import { FontFamily } from '@euler/components/typography';
import { TaskDetail } from '@euler/model';
import { CommonTaskStatus, InspectionTaskStatus } from '@euler/model/enum';
import { VehicleReportProjection } from '@euler/model/report';
import { ReportTabKey } from '@euler/model/viewmodel';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { memo, useCallback } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { TaskCard } from './TaskCard';

const Cell = TableView.Item;

export const TaskStatusInfo = memo(({ detail }: { detail: TaskDetail }) => {
  const navigation =
    useNavigation<StackNavigationProp<TaskNavParams & AppNavParams>>();

  const onStatusRowClick = useCallback(
    (
      options: {
        screen?: keyof ReportNavParams;
        title?: string;
        initialTab?: ReportTabKey;
      } & { [p in keyof VehicleReportProjection]: boolean },
    ) => {
      const { initialTab, screen, ...params } = options;
      if (!screen) {
        navigation.push('Report', {
          taskNo: detail!.taskNo,
          initialTab,
          ...params,
        });
      } else {
        navigation.push(screen, {
          taskNo: detail!.taskNo,
          ...params,
        });
      }
    },
    [detail, navigation],
  );

  return (
    <TaskCard
      title="在厂进度"
      headerRight="进度详情"
      onHeaderRightPress={() => {
        navigation.navigate('timeline', {});
      }}
      noBodyPadding
    >
      <TableView>
        <Cell
          title="接车检查"
          subTitle={detail.preInspectedBy ? `(${detail.preInspectedBy})` : ''}
          detailIcon="disclosure"
          detail={
            <StatusLabel status={detail.preInspectionStatus} continuable />
          }
          hidden={
            detail.status === InspectionTaskStatus.Finished &&
            detail.preInspectionStatus !== CommonTaskStatus.Finished
          }
          onPress={() => {
            onStatusRowClick({
              screen: 'PreInspectionReport',
            });
          }}
        />
        <Cell
          title="常规检测"
          subTitle={detail.inspectedBy ? `(${detail.inspectedBy})` : ''}
          detailIcon="disclosure"
          detail={<StatusLabel status={detail.inspectionStatus} continuable />}
          hidden={
            detail.status === InspectionTaskStatus.Finished &&
            detail.inspectionStatus !== CommonTaskStatus.Finished
          }
          onPress={() => {
            onStatusRowClick({
              screen: 'InspectionReport',
            });
          }}
        />
        <Cell
          title="施工反馈"
          subTitle={detail.constructedBy ? `(${detail.constructedBy})` : ''}
          detailIcon="disclosure"
          detail={
            <StatusLabel
              status={
                detail.constructionStatus === CommonTaskStatus.Pending &&
                detail.isConstructionJobScheduled
                  ? CommonTaskStatus.InProgress
                  : detail.constructionStatus
              }
              continuable
            />
          }
          hidden={
            detail.status === InspectionTaskStatus.Finished &&
            detail.constructionStatus !== CommonTaskStatus.Finished
          }
          onPress={() => {
            onStatusRowClick({
              screen: 'ConsturctionReport',
            });
          }}
        />
        <Cell
          title="交车检查"
          subTitle={
            detail.deliveryCheckedBy ? `(${detail.deliveryCheckedBy})` : ''
          }
          detailIcon="disclosure"
          detail={
            <StatusLabel status={detail.deliveryCheckStatus} continuable />
          }
          hidden={
            detail.status === InspectionTaskStatus.Finished &&
            detail.deliveryCheckStatus !== CommonTaskStatus.Finished
          }
          onPress={() => {
            onStatusRowClick({
              screen: 'DeliveryCheckReport',
            });
          }}
        />
      </TableView>
      {detail.status === InspectionTaskStatus.Finished && (
        <TouchableOpacity
          css={`
            padding: 8px;
            align-items: center;
            justify-content: center;
            background-color: ${Colors.Gray8};
          `}
          onPress={() => {
            onStatusRowClick({
              preInspection:
                detail.preInspectionStatus === CommonTaskStatus.Finished,
              inspection: detail.inspectionStatus === CommonTaskStatus.Finished,
              construction:
                detail.constructionStatus === CommonTaskStatus.Finished,
              deliveryCheck:
                detail.deliveryCheckStatus === CommonTaskStatus.Finished,
              title: '报告详情',
            });
          }}
        >
          <Text
            css={`
              font-family: ${FontFamily.NotoSans.Light};
              font-size: 12px;
            `}
          >
            查看完整报告
          </Text>
        </TouchableOpacity>
      )}
    </TaskCard>
  );
});
