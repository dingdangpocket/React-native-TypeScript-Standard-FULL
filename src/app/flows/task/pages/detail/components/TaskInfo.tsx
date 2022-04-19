/* eslint-disable @typescript-eslint/no-use-before-define */
import { Timestamp } from '@euler/app/flows/task/components/Timestamp';
import { TaskNavParams } from '@euler/app/flows/task/TaskFlow';
import { AppNavParams } from '@euler/app/Routes';
import { Avatar, Colors } from '@euler/components';
import { Img } from '@euler/components/adv-image/AdvancedImage';
import { FontFamily } from '@euler/components/typography';
import { useSystemMetrics } from '@euler/functions';
import { InspectionTaskStatus } from '@euler/model/enum';
import { TaskBasicInfo } from '@euler/model/task-detail';
import { SafeHaptics } from '@euler/utils';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import dayjs from 'dayjs';
import * as Clipboard from 'expo-clipboard';
import { memo, useCallback } from 'react';
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Toast from 'react-native-root-toast';
import styled, { css, useTheme } from 'styled-components/native';
import { TaskCard } from './TaskCard';

export const TaskInfo = memo(
  ({
    taskNo,
    orderNo,
    vin,
    licensePlateNo,
    vehicleBrandLogo,
    vehicleName,
    serviceAgentName,
    status,
    createdAt,
    finishedAt,
    vehicleMileage,
    vehicleFuelType,
    remark,

    storeName,
    showVehicleName,
    brandLogoPosition,
  }: {
    storeName: string;
    showVehicleName?: boolean;
    brandLogoPosition?: 'left' | 'right';
  } & TaskBasicInfo) => {
    const theme = useTheme();
    const navigation =
      useNavigation<StackNavigationProp<AppNavParams & TaskNavParams>>();
    const { navBarHeight } = useSystemMetrics();

    const onEditBasicInfo = useCallback(() => {
      console.log('edit basic info');
    }, []);

    const onQrcodeSharingPress = useCallback(() => {
      navigation.navigate('qrcodeSharing', {
        taskNo,
        licensePlateNo,
        storeName,
        top: navBarHeight,
      });
    }, [navigation, taskNo, licensePlateNo, storeName, navBarHeight]);

    // todo: fetch task extra info for this
    const hasObserved = true;

    return (
      <>
        <TaskCard
          title="接车信息"
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
              margin-right: ${brandLogoPosition === 'right' ? 0 : 11}px;
            `}
          >
            <Img
              uri={vehicleBrandLogo}
              css={`
                width: 40px;
                height: 40px;
                flex-grow: 0;
                flex-shrink: 0;
                ${brandLogoPosition === 'right'
                  ? css`
                      position: absolute;
                      right: 15px;
                      top: 8px;
                    `
                  : ''}
              `}
            />
            <View
              css={`
                flex: 1;
              `}
            >
              {showVehicleName !== false && (
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
              )}
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
      </>
    );
  },
);

const SaInfo = styled.Text`
  font-family: ${FontFamily.NotoSans.Light};
  font-size: 12px;
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
            font-size: 12px;
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
            font-size: 13px;
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

const SecondaryInfoText = styled.Text.attrs(props => ({
  numberOfLines: 1,
  ...props,
}))`
  font-family: ${FontFamily.NotoSans.Light};
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 6.5px;
  color: #555;
`;
