/**
 * @file: InspectionInfo.tsx
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

/* eslint-disable @typescript-eslint/no-use-before-define */
import { LinkButton } from '@euler/app/components/LinkButton';
import { StatusLabel } from '@euler/app/flows/task/components/StatusLabel';
import { flowStatusToCommonTaskStatus } from '@euler/app/flows/task/functions';
import { Img } from '@euler/components/adv-image/AdvancedImage';
import { TableView } from '@euler/components/TableView';
import { Label } from '@euler/components/typography/Label';
import { VehicleInspectionFlow } from '@euler/model';
import { CommonTaskStatus, InspectionCategory } from '@euler/model/enum';
import { Inspection } from '@euler/model/task-detail';
import { sorted } from '@euler/utils/array';
import { dateFromValue } from '@euler/utils/datetime';
import { timeUtilNow } from '@euler/utils/formatters';
import { AntDesign, Entypo } from '@expo/vector-icons';
import compareAsc from 'date-fns/compareAsc';
import { memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components';
import { TaskCard } from './TaskCard';

export const InspectionInfo = memo(
  ({
    detail,
    onNewFlowPress,
    onFlowPress,
  }: {
    detail: Inspection;
    onNewFlowPress?: (category: InspectionCategory) => void;
    onFlowPress?: (flow: VehicleInspectionFlow) => void;
  }) => {
    return (
      <TaskCard
        title="车辆检测"
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
        <FlowList
          inspectionStatus={detail.status}
          inspectionFlows={detail.flows}
          onNewFlowPress={onNewFlowPress}
          onFlowPress={onFlowPress}
        />
      </TaskCard>
    );
  },
);

const FlowList = memo(
  ({
    inspectionStatus,
    inspectionFlows,
    onFlowPress,
    onNewFlowPress,
  }: {
    inspectionStatus: CommonTaskStatus;
    inspectionFlows: VehicleInspectionFlow[];
    onNewFlowPress?: (category: InspectionCategory) => void;
    onFlowPress?: (flow: VehicleInspectionFlow) => void;
  }) => {
    const theme = useTheme();

    const onNewFlow = useCallback(() => {
      onNewFlowPress?.(InspectionCategory.Normal);
    }, [onNewFlowPress]);

    const flows = useMemo(
      () =>
        sorted(inspectionFlows, (x, y) =>
          compareAsc(dateFromValue(x.createdAt), dateFromValue(y.createdAt)),
        ),
      [inspectionFlows],
    );

    return (
      <TableView>
        {flows.map(flow => (
          <TableView.Item
            key={flow.id}
            title={flow.name}
            titleStyle={{ fontSize: 17, marginBottom: 5, lineHeight: 20 }}
            note={
              <View>
                <Label
                  size={14}
                  light
                  color={p => p.components.table.item.noteColor}
                >
                  {flow.description ?? '暂无该检测任务的说明'}
                </Label>
                <Label
                  size={12}
                  light
                  color={p => p.components.table.item.noteColor}
                  css={`
                    margin-top: 3px;
                  `}
                >
                  {flow.assignedTo.name}
                  {'  '}
                  {timeUtilNow(flow.createdAt)}
                </Label>
              </View>
            }
            noteStyle={{ fontSize: 12 }}
            iconStyle={{ marginRight: 10 }}
            detailIcon="disclosure"
            contentContainerStyle={{
              paddingTop: 15,
              paddingBottom: 15,
            }}
            icon={
              flow.template.icon ? (
                <Img
                  uri={flow.template.icon}
                  css={`
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                  `}
                />
              ) : (
                <Entypo name="layers" size={32} color="#5BA0E0" />
              )
            }
            detail={
              <View
                css={`
                  align-items: flex-end;
                  justify-content: center;
                  margin-left: 15px;
                `}
              >
                <StatusLabel
                  status={flowStatusToCommonTaskStatus(flow.status)}
                  continuable
                />
              </View>
            }
            onPress={onFlowPress?.bind(null, flow)}
          />
        ))}
        {flows.length === 0 ? (
          <TableView.Item onPress={onNewFlow}>
            <Label light color={p => p.form.label.color} size={14}>
              检测未开始，点击添加检测任务
            </Label>
          </TableView.Item>
        ) : null}
        {inspectionStatus !== CommonTaskStatus.Finished ? (
          <TableView.Item
            contentContainerStyle={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={onNewFlow}
          >
            <LinkButton text="添加检测任务" onPress={onNewFlow} />
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
  },
);
