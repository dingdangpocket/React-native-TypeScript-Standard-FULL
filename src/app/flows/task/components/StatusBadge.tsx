import { Center } from '@euler/components';
import { FontFamily } from '@euler/components/typography';
import { VehicleInspectionTask } from '@euler/model/entity';
import { CommonTaskStatus, InspectionTaskStatus } from '@euler/model/enum';
import { memo } from 'react';
import { StyleProp, Text, ViewStyle } from 'react-native';

export const StatusBadge = memo(
  ({
    task,
    style,
  }: {
    task: VehicleInspectionTask;
    style?: StyleProp<ViewStyle>;
  }) => {
    type StatusInfo = [string, string, string?];
    const statusList: StatusInfo[] = [];

    if (task.status === InspectionTaskStatus.InProgress) {
      if (task.deliveryCheckStatus === CommonTaskStatus.Finished) {
        statusList.push(['已验收', '#00AA55']);
      }
      if (task.deliveryCheckStatus === CommonTaskStatus.InProgress) {
        statusList.push(['质检中', '#4f01bb']);
      } else if (task.constructionStatus === CommonTaskStatus.Finished) {
        if (task.deliveryCheckStatus === CommonTaskStatus.Pending) {
          statusList.push(['待质检', '#06a7c4']);
        }
      } else if (
        task.constructionStatus === CommonTaskStatus.InProgress ||
        task.isConstructionJobScheduled
      ) {
        statusList.push(['施工中', '#009FD4']);
      } else if (task.inspectionStatus === CommonTaskStatus.Finished) {
        statusList.push(['待施工', '#8e78ff']);
      } else if (task.inspectionStatus === CommonTaskStatus.InProgress) {
        statusList.push(['检测中', '#2e3191']);
      } else if (task.preInspectionStatus === CommonTaskStatus.InProgress) {
        statusList.push(['预检中', '#B381B3']);
      } else if (task.preInspectionStatus === CommonTaskStatus.Finished) {
        statusList.push(['待检测', '#fc7d7b']);
      }
    } else if (task.status === InspectionTaskStatus.Cancelled) {
      statusList.push(['已取消', '#d3155a']);
    } else if (task.status === InspectionTaskStatus.Finished) {
      statusList.push(['已完工', '#00AA55']);
    }

    if (!statusList.length) {
      statusList.push(['已建单', '#939393']);
    }

    const status = statusList[0];

    if (!status) return null;

    const [text, bgColor, color] = status;
    return (
      <Center
        css={`
          padding: 0 8px;
          height: 22px;
          border-radius: 11px;
          background-color: ${bgColor};
        `}
        style={style}
      >
        <Text
          css={`
            font-family: ${FontFamily.NotoSans.Light};
            font-size: 12px;
            line-height: 22px;
            color: ${color ?? '#fff'};
          `}
        >
          {text}
        </Text>
      </Center>
    );
  },
);
