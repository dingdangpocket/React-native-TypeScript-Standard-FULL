/* eslint-disable @typescript-eslint/no-use-before-define */
import { useAppLoading } from '@euler/app/components/loading';
import { useCurrentStore } from '@euler/app/flows/auth';
import { useTaskContext } from '@euler/app/flows/task/functions/TaskContext';
import { TaskNavParams } from '@euler/app/flows/task/TaskFlow';
import { AppNavParams, ReportNavParams } from '@euler/app/Routes';
import { kMiniprogramSharingThumbnailImageUrl } from '@euler/assets';
import { Colors } from '@euler/components';
import { AdvancedImage } from '@euler/components/adv-image/AdvancedImage';
import { Avatar } from '@euler/components/Avatar';
import { Card } from '@euler/components/Card';
import { TableView } from '@euler/components/TableView';
import { FontFamily } from '@euler/components/typography';
import { config, envTypeToTag } from '@euler/config';
import { wrapNavigatorScreen } from '@euler/functions';
import { CommonTaskStatus, InspectionTaskStatus } from '@euler/model/enum';
import { VehicleReportProjection } from '@euler/model/report';
import { ReportTabKey } from '@euler/model/viewmodel';
import { useServiceFactory } from '@euler/services/factory';
import { SafeHaptics } from '@euler/utils';
import { useActionSheet } from '@expo/react-native-action-sheet';
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { useHeaderHeight } from '@react-navigation/elements';
import { StackNavigationProp } from '@react-navigation/stack';
import dayjs from 'dayjs';
import * as Clipboard from 'expo-clipboard';
import React, { memo, useCallback, useEffect } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Toast from 'react-native-root-toast';
import * as WeChat from 'react-native-wechat-lib';
import styled, { useTheme } from 'styled-components/native';
import { StatusLabel } from '../components/StatusLabel';
import { Timestamp } from '../components/Timestamp';

export const TaskDetailScreen = wrapNavigatorScreen(
  () => {
    const headerHeight = useHeaderHeight();
    const store = useCurrentStore();
    const { detail, isRefreshing, fetchDetail } = useTaskContext();
    const {
      taskNo,
      orderNo,
      licensePlateNo,
      vin,
      vehicleName,
      vehicleMileage,
      vehicleFuelType,
      serviceAgentName,
      status,
      createdAt,
      finishedAt,
      remark,
    } = detail.basicInfo;
    console.log('number', taskNo);
    const theme = useTheme();
    const { taskService } = useServiceFactory();

    const onEditBasicInfo = useCallback(() => {
      console.log('edit basic info');
    }, []);

    const navigation = useNavigation<StackNavigationProp<AppNavParams> | any>();
    const loading = useAppLoading();
    const { showActionSheetWithOptions } = useActionSheet();

    const showActions = useCallback(() => {
      showActionSheetWithOptions(
        {
          options: ['分享微信小程序给车主', '分享微信小程序给服务顾问', '取消'],
          cancelButtonIndex: 2,
        },
        async buttonIndex => {
          if (buttonIndex === 0 || buttonIndex === 1) {
            const installed = await WeChat.isWXAppInstalled();
            if (!installed) {
              Toast.show('微信未安装', {
                duration: 1000,
                position: Toast.positions.BOTTOM,
              });
              return;
            }
            loading.show();
            try {
              const params =
                await taskService.getMiniprogramReportSharingParams(taskNo, {
                  envTag:
                    config.environment === 'dev'
                      ? undefined
                      : envTypeToTag(config.environment),
                  shareType: buttonIndex === 1 ? 'sa' : undefined,
                });
              loading.hide();
              const resp = await WeChat.shareMiniProgram({
                webpageUrl: config.linking.url,
                userName: params.userName,
                path: params.pagePath,
                title: `${detail.basicInfo.licensePlateNo}的车检报告`,
                hdImageUrl: kMiniprogramSharingThumbnailImageUrl,
                thumbImageUrl: kMiniprogramSharingThumbnailImageUrl,
                scene: 0,
              });
              if (resp.errCode) {
                console.error(resp.errStr);
                Toast.show('分享失败');
              }
            } catch (e) {
              loading.hide();
              console.error(e);
              Toast.show('获取分享参数失败');
            }
          }
        },
      );
    }, [
      showActionSheetWithOptions,
      loading,
      taskService,
      taskNo,
      detail.basicInfo.licensePlateNo,
    ]);

    useEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              showActions();
            }}
            css={`
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              margin-right: 8px;
            `}
          >
            <Ionicons
              name="ios-ellipsis-vertical-sharp"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        ),
      });
    }, [navigation, showActions]);

    const onStatusRowClick = useCallback(
      (
        options: {
          screen?: keyof ReportNavParams | keyof TaskNavParams;
          title?: string;
          initialTab?: ReportTabKey;
          taskDetail?: object;
        } & { [p in keyof VehicleReportProjection]: boolean },
      ) => {
        const { initialTab, screen, ...params } = options;
        if (!screen) {
          navigation.push('Report', {
            taskNo,
            initialTab,
            ...params,
          });
        } else {
          navigation.push(screen, {
            taskNo,
            ...params,
          });
        }
      },
      [navigation, taskNo],
    );

    const onQrcodeSharingPress = useCallback(() => {
      navigation.navigate('QrcodeSharing', {
        taskNo,
        licensePlateNo: licensePlateNo,
        storeName: store.name,
        top: headerHeight,
      });
    }, [headerHeight, licensePlateNo, navigation, store.name, taskNo]);

    // todo fetching the extra info of task.
    const hasObserved = true;

    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={fetchDetail} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 15,
          flex: 1,
        }}
      >
        <TaskCard
          title="基本信息"
          headerRight={`修改信息`}
          onHeaderRightPress={onEditBasicInfo}
          noBodyPadding
        >
          <View
            css={`
              flex-direction: row;
              flex-wrap: nowrap;
              justify-content: space-between;
              align-items: flex-start;
              padding: 10px 15px;
            `}
          >
            <AdvancedImage
              uri={detail.basicInfo.vehicleBrandLogo}
              css={`
                width: 40px;
                height: 40px;
                flex-grow: 0;
                flex-shrink: 0;
              `}
            />
            <View
              css={`
                margin-left: 11px;
                flex: 1;
              `}
            >
              <Text
                numberOfLines={1}
                css={`
                  font-family: ${FontFamily.NotoSans.Medium};
                  font-size: 18px;
                  line-height: 20px;
                  margin-bottom: 8px;
                `}
              >
                {vehicleName}
              </Text>
              <SecondaryInfo label="订单号" value={orderNo} />
              <SecondaryInfo label="工单号" value={taskNo} />
              <SecondaryInfo label="车架号" value={vin} />
              <View
                css={`
                  flex-direction: row;
                  justify-content: flex-start;
                  align-items: center;
                  flex-wrap: nowrap;
                  margin-top: 4px;
                `}
              >
                <Avatar
                  name={serviceAgentName}
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
                  {serviceAgentName}
                </SaInfo>
                <Timestamp
                  timestamp={createdAt}
                  value={
                    status === InspectionTaskStatus.Finished
                      ? dayjs(finishedAt!).diff(dayjs(createdAt)) / 1000
                      : undefined
                  }
                  label={
                    status === InspectionTaskStatus.Finished
                      ? '耗时'
                      : undefined
                  }
                  css={`
                    margin-left: 8px;
                  `}
                  labelStyle={{
                    color: '#555',
                    fontSize: 12,
                  }}
                />
              </View>
            </View>
          </View>
          <View
            css={`
              margin-bottom: 15px;
              flex-direction: row;
              justify-content: space-around;
              align-items: center;
            `}
          >
            <InfoCell label="车牌" content={licensePlateNo} />
            <InfoCell label="当前里程" content={`${vehicleMileage}公里`} />
            <InfoCell label="燃油类型" content={vehicleFuelType ?? '-'} />
          </View>
          <TouchableOpacity
            onPress={onQrcodeSharingPress}
            css={`
              padding: 8px 15px;
              background-color: ${hasObserved
                ? theme.colors.status.success
                : theme.colors.status.warn};
              flex-direction: row;
              align-items: center;
              flex-wrap: nowrap;
            `}
          >
            <MaterialIcons
              name="info-outline"
              size={13}
              color={'#fff'}
              css={`
                flex-shrink: 0;
              `}
            />
            <Text
              numberOfLines={1}
              css={`flex: 1;
            font-family: ${FontFamily.NotoSans.Thin}
            font-size: 12px;
            color: #fff;
            margin: 0 2px;
            `}
            >
              {hasObserved ? '车主已关注本次服务' : '车主尚未关注本次服务'}
            </Text>
            <FontAwesome
              name="qrcode"
              size={13}
              color="white"
              css={`
                flex-shrink: 0;
              `}
            />
          </TouchableOpacity>
        </TaskCard>
        {remark ? (
          <TaskCard title="服务备注">
            <Text
              css={`
                font-family: ${FontFamily.NotoSans.Regular};
                font-size: 12px;
                color: ${Colors.Gray3};
              `}
            >
              {remark}
            </Text>
          </TaskCard>
        ) : null}
        <TaskCard
          title="在厂进度"
          headerRight="进度详情"
          onHeaderRightPress={() => {
            navigation.navigate('Timeline', { taskNo });
          }}
          noBodyPadding
        >
          <TableView>
            <Cell
              title="接车检查"
              subTitle={
                detail.preInspection.finishedBy
                  ? `(${detail.preInspection.finishedBy})`
                  : ''
              }
              detailIcon="disclosure"
              detail={
                <StatusLabel status={detail.preInspection.status} continuable />
              }
              hidden={
                status === InspectionTaskStatus.Finished &&
                detail.preInspection.status !== CommonTaskStatus.Finished
              }
              // onPress={() => {
              //   onStatusRowClick({
              //     screen: 'PreInspectionReport',
              //   });
              // }}
              onPress={() => {
                onStatusRowClick({
                  screen: 'PreInspectionComfirm',
                });
              }}
            />
            <Cell
              title="常规检测"
              subTitle={
                detail.inspection.finishedBy
                  ? `(${detail.inspection.finishedBy})`
                  : ''
              }
              detailIcon="disclosure"
              detail={
                <StatusLabel status={detail.inspection.status} continuable />
              }
              hidden={
                status === InspectionTaskStatus.Finished &&
                detail.inspection.status !== CommonTaskStatus.Finished
              }
              onPress={() => {
                onStatusRowClick({
                  screen: 'InspectionReport',
                });
              }}
            />
            <Cell
              title="施工反馈"
              subTitle={
                detail.construction.finishedBy
                  ? `(${detail.construction.finishedBy})`
                  : ''
              }
              detailIcon="disclosure"
              detail={
                <StatusLabel
                  status={
                    detail.construction.status === CommonTaskStatus.Pending &&
                    detail.construction.isScheduled
                      ? CommonTaskStatus.InProgress
                      : detail.construction.status
                  }
                  continuable
                />
              }
              hidden={
                status === InspectionTaskStatus.Finished &&
                detail.construction.status !== CommonTaskStatus.Finished
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
                detail.deliveryCheck.finishedBy
                  ? `(${detail.deliveryCheck.finishedBy})`
                  : ''
              }
              detailIcon="disclosure"
              detail={
                <StatusLabel status={detail.deliveryCheck.status} continuable />
              }
              hidden={
                status === InspectionTaskStatus.Finished &&
                detail.deliveryCheck.status !== CommonTaskStatus.Finished
              }
              // onPress={() => {
              //   onStatusRowClick({
              //     screen: 'DeliveryCheckReport',
              //   });
              // }}
              onPress={() => {
                onStatusRowClick({
                  screen: 'DeliveryInspection',
                });
              }}
            />
          </TableView>
          {status === InspectionTaskStatus.Finished && (
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
                    detail.preInspection.status === CommonTaskStatus.Finished,
                  inspection:
                    detail.inspection.status === CommonTaskStatus.Finished,
                  construction:
                    detail.construction.status === CommonTaskStatus.Finished,
                  deliveryCheck:
                    detail.deliveryCheck.status === CommonTaskStatus.Finished,
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
      </ScrollView>
    );
  },
  { title: '工单详情' },
);

const SaInfo = styled.Text`
  font-family: ${FontFamily.NotoSans.Thin};
  font-size: 12px;
  color: #555;
`;

const TaskCard = styled(Card)`
  border-width: 1px;
  border-color: #ddd;
  margin-bottom: 15px;
`;

const Cell = TableView.Item;

const SecondaryInfoText = styled.Text.attrs(props => ({
  numberOfLines: 1,
  ...props,
}))`
  font-family: ${FontFamily.NotoSans.Thin};
  font-size: 13px;
  line-height: 16px;
  margin-bottom: 6.5px;
  color: #555;
`;

const SecondaryInfo = memo(
  ({
    label,
    value,
    style,
  }: {
    label: string;
    value: string;
    style?: StyleProp<ViewStyle>;
  }) => {
    const onCopy = useCallback(() => {
      Clipboard.setString(value);
      Toast.show('已复制', {
        duration: 500,
        position: Toast.positions.CENTER,
      });
      SafeHaptics.impact();
    }, [value]);

    return (
      <View
        css={`
          flex-direction: row;
          align-items: center;
        `}
        style={style}
      >
        <SecondaryInfoText>{`${label}: ${value}`}</SecondaryInfoText>
        <TouchableOpacity
          onPress={onCopy}
          hitSlop={{ left: 8, top: 8, right: 8, bottom: 8 }}
          css={`
            margin-left: 8px;
            position: relative;
            top: -2.5px;
          `}
        >
          <Feather name="copy" size={12} color="#ccc" />
        </TouchableOpacity>
      </View>
    );
  },
);

const InfoCell = memo(
  ({ label, content }: { label: string; content: string }) => {
    return (
      <View
        css={`
          align-items: center;
          justify-content: center;
        `}
      >
        <Text
          css={`
            font-family: ${FontFamily.NotoSans.Thin};
            font-size: 11px;
            color: #666;
            line-height: 16px;
            margin-bottom: 2px;
          `}
        >
          {label}
        </Text>
        <Text
          css={`
            font-family: ${FontFamily.NotoSans.Thin};
            font-size: 12px;
            color: #333;
            line-height: 20px;
          `}
        >
          {content}
        </Text>
      </View>
    );
  },
);
