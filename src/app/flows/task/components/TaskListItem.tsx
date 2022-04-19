import { Avatar } from '@euler/components';
import { AdvancedImage } from '@euler/components/adv-image/AdvancedImage';
import { FontFamily } from '@euler/components/typography';
import { VehicleInspectionTask } from '@euler/model/entity';
import { InspectionTaskStatus } from '@euler/model/enum';
import { EvilIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { memo, useCallback } from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { ObserveStatus } from './ObserveStatus';
import { StatusBadge } from './StatusBadge';
import { Timestamp } from './Timestamp';

const PrimaryInfo = styled.Text`
  font-family: ${FontFamily.NotoSans.Regular};
  font-size: 16px;
`;

const SecondaryInfo = styled.Text`
  font-family: ${FontFamily.NotoSans.Light};
  font-size: 13px;
`;

const SaInfo = styled.Text`
  font-family: ${FontFamily.NotoSans.Light};
  font-size: 11px;
`;

export const TaskListItem = memo(
  ({
    task,
    style,
    onPress,
  }: {
    task: VehicleInspectionTask;
    style?: StyleProp<ViewStyle>;
    onPress?: (task: VehicleInspectionTask) => void;
  }) => {
    const onTaskPress = useCallback(() => {
      onPress?.(task);
    }, [onPress, task]);
    return (
      <TouchableOpacity style={style} onPress={onTaskPress}>
        <View
          css={`
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            background-color: #fff;
            padding: 12px 5px 12px 10px;
            box-shadow: 0 0 10px #ccc;
            elevation: 50;
            margin: 6px 15px;
            border-radius: 10px;
          `}
        >
          <AdvancedImage
            uri={task.vehicleBrandLogo}
            css={`
              width: 50px;
              height: 50px;
              flex-grow: 0;
              flex-shrink: 0;
            `}
          />
          <View
            css={`
              flex: 1;
              margin-left: 8px;
            `}
          >
            <PrimaryInfo
              numberOfLines={1}
              css={`
                margin-bottom: 5px;
              `}
            >
              {task.vehicleName ?? ''}
            </PrimaryInfo>
            <View
              css={`
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: flex-start;
                align-items: center;
                margin-bottom: 6px;
              `}
            >
              <SecondaryInfo>{task.licensePlateNo}</SecondaryInfo>
              <SecondaryInfo
                css={`
                  margin-left: 8px;
                `}
              >
                {task.vehicleMileage}公里
              </SecondaryInfo>
            </View>
            <View
              css={`
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: flex-start;
                align-items: center;
              `}
            >
              <Avatar
                name={task.serviceAgentName}
                css={`
                  width: 18px;
                  height: 18px;
                  border-radius: 9px;
                `}
              />
              <SaInfo
                css={`
                  margin-left: 4px;
                `}
              >
                {task.serviceAgentName}
              </SaInfo>
              <Timestamp
                timestamp={task.createdAt}
                value={
                  task.status === InspectionTaskStatus.Finished
                    ? dayjs(task.finishedAt!).diff(dayjs(task.createdAt)) / 1000
                    : undefined
                }
                label={
                  task.status === InspectionTaskStatus.Finished
                    ? '耗时'
                    : undefined
                }
                css={`
                  margin-left: 8px;
                `}
              />
              <ObserveStatus
                checked={Boolean(task.observes?.length)}
                label={task.observes?.length ? '已关注' : '未关注'}
                css={`
                  margin-left: 8px;
                `}
              />
            </View>
          </View>
          <StatusBadge
            task={task}
            css={`
              flex-shrink: 0;
              flex-grow: 0;
              margin-right: -5px;
            `}
          />
          <EvilIcons
            name="chevron-right"
            size={32}
            color="#aaa"
            css={`
              flex-shrink: 0;
              flex-grow: 0;
              margin-right: -5px;
            `}
          />
        </View>
      </TouchableOpacity>
    );
  },
);
