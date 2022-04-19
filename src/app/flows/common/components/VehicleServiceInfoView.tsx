/* eslint-disable @typescript-eslint/no-use-before-define */
import { IconProps } from '@euler/app/components/icons/types';
import { Center, StatusColors } from '@euler/components';
import { AdvancedImage } from '@euler/components/adv-image/AdvancedImage';
import { FontFamily } from '@euler/components/typography';
import { AsyncState } from '@euler/functions/useFetchAsyncState';
import { VehicleInfoCore, VehicleServiceRecord } from '@euler/model';
import { VehicleServiceInfo } from '@euler/services';
import { formatDateTime } from '@euler/utils/formatters';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { memo, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { css } from 'styled-components';
import styled from 'styled-components/native';

const kLogoSize = 40;
const kVehicleImageWidth = 89;
const kVehicleImageHeight = 60;

const ImagePlaceholder = memo(
  ({
    style,
    textStyle,
  }: {
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
  }) => {
    return (
      <Center
        css={`
          background-color: #eee;
        `}
        style={style}
      >
        <Text
          css={`
            font-family: ${FontFamily.NotoSans.Regular};
            font-size: 12px;
            color: #ccc;
          `}
          style={textStyle}
        >
          暂无图片
        </Text>
      </Center>
    );
  },
);

const baseLogoCss = css`
  width: ${kLogoSize}px;
  height: ${kLogoSize}px;
  margin-right: 10px;
  flex-shrink: 0;
  flex-grow: 0;
`;

const baseVehicleImageCss = css`
  width: ${kVehicleImageWidth}px;
  height: ${kVehicleImageHeight}px;
  margin-left: 10px;
  flex-shrink: 0;
  flex-grow: 0;
`;

const WeixinIcon = memo(
  ({ size, width, height, color = '#fff', ...props }: IconProps) => (
    <Svg
      width={width ?? size ?? 13}
      height={height ?? size ?? 12}
      fill="none"
      {...props}
    >
      <Path
        d="M7.442 8.24a.398.398 0 0 1 .539 0 .34.34 0 0 1 .05.45l-.05.055-.156.148c-.27.253-.48.648-.48 1.01 0 .363.15.703.42.958.272.253.635.394 1.022.394.339 0 .658-.107.915-.305l.105-.09.215-.201a.398.398 0 0 1 .54 0 .342.342 0 0 1 .048.448l-.048.056-.216.203c-.21.196-.458.35-.73.452-.264.1-.546.15-.83.15-.286 0-.565-.05-.83-.15a2.198 2.198 0 0 1-.728-.452 2.041 2.041 0 0 1-.483-.684 1.956 1.956 0 0 1 0-1.556c.092-.215.261-.448.436-.634l.105-.105.157-.146ZM6.05.5c3.38 0 6.048 2.166 6.048 4.833 0 .094-.004.187-.01.279a2.826 2.826 0 0 0-3.085.102l-.16.122L6.73 7.558a2.77 2.77 0 0 0-.844 1.17 2.74 2.74 0 0 0-.137 1.43l-.309-.027c-.508-.059-1.017-.178-1.525-.297l-1.956 1 .533-1.666C1.067 8.168 0 6.834 0 5.333 0 2.667 2.846.5 6.048.5Zm4.599 7.719a.413.413 0 0 1 .09.467.41.41 0 0 1-.102.136L9.388 9.95a.476.476 0 0 1-.642-.01.412.412 0 0 1-.09-.467.412.412 0 0 1 .1-.135l1.248-1.13a.476.476 0 0 1 .643.01Zm-.078-2.05c.287 0 .565.051.83.151.274.104.518.257.73.452.209.198.371.428.482.684a1.955 1.955 0 0 1 0 1.556 2.022 2.022 0 0 1-.363.562l-.12.122-.214.2a.398.398 0 0 1-.54 0 .34.34 0 0 1-.049-.448l.05-.055.215-.202a1.31 1.31 0 0 0 .42-.957 1.297 1.297 0 0 0-.42-.957 1.485 1.485 0 0 0-1.02-.394 1.496 1.496 0 0 0-.916.305l-.106.09-.215.201a.398.398 0 0 1-.539 0 .341.341 0 0 1-.048-.448l.048-.056.215-.203c.21-.195.456-.348.73-.452.264-.1.543-.15.83-.15ZM8.004 3.168c-.533 0-.889.333-.889.666s.355.668.89.668c.355 0 .71-.335.71-.668 0-.332-.354-.666-.71-.666Zm-3.912 0c-.534 0-.89.333-.89.666s.356.668.889.668c.356 0 .711-.335.711-.668 0-.332-.355-.666-.711-.666Z"
        fill={color}
      />
    </Svg>
  ),
);

const VehicleInfoView = memo(
  ({
    vehicleInfo,
    hasObservers,
    serviceRecordCount,
    ...props
  }: {
    hasObservers?: boolean;
    vehicleInfo: VehicleInfoCore;
    serviceRecordCount: number;
  } & ViewProps) => {
    return (
      <View
        css={`
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          padding-bottom: 10px;
          margin-left: 15px;
          margin-right: 15px;
          margin-top: 5px;
          flex-shrink: 0;
          background-color: #fff;
        `}
        {...props}
      >
        <AdvancedImage
          uri={vehicleInfo.vehicleBrandLogo}
          css={`
            ${baseLogoCss}
          `}
          placeholder={
            <ImagePlaceholder
              css={`
                ${baseLogoCss}
              `}
            />
          }
        />
        <View
          css={`
            flex: 1;
          `}
        >
          <Text
            numberOfLines={1}
            css={`
              font-family: ${FontFamily.NotoSans.Medium};
              font-size: 18px;
              line-height: 24px;
              color: #333;
            `}
          >
            {vehicleInfo.vehicleName}
          </Text>
          <View>
            <Label
              css={`
                line-height: 20px;
              `}
            >
              VIN: {vehicleInfo.vin}
            </Label>
          </View>
          <View
            css={`
              flex-direction: row;
              align-items: center;
              margin-top: 5px;
            `}
          >
            <Center
              css={`
                height: 22px;
                border-radius: 2px;
                background-color: #f2f2f2;
                padding: 0 8px;
              `}
            >
              <Text
                css={`
                  font-family: ${FontFamily.NotoSans.Regular};
                  font-size: 12px;
                  line-height: 22px;
                  color: #333;
                `}
              >
                {vehicleInfo.licensePlateNo}
              </Text>
            </Center>
            <Center
              css={`
                height: 22px;
                border-radius: 2px;
                background-color: ${hasObservers
                  ? '#3ecc82'
                  : StatusColors.Warn};
                flex-direction: row;
                padding: 0 8px;
                margin-left: 10px;
              `}
            >
              <WeixinIcon />
              <Text
                css={`
                  font-family: ${FontFamily.NotoSans.Regular};
                  font-size: 12px;
                  line-height: 22px;
                  color: #fff;
                  margin-left: 4px;
                `}
              >
                {hasObservers ? '已关注' : '未关注'}
              </Text>
            </Center>
          </View>
          <View
            css={`
              margin-top: 3px;
              flex-direction: row;
              align-items: center;
            `}
          >
            <Label>{serviceRecordCount}条服务记录</Label>
          </View>
        </View>
        <AdvancedImage
          uri={vehicleInfo.vehicleImageUrl}
          css={`
            ${baseVehicleImageCss}
          `}
          placeholder={
            <ImagePlaceholder
              css={`
                ${baseVehicleImageCss}
              `}
            />
          }
        />
      </View>
    );
  },
);

const Label = styled.Text`
  font-family: ${FontFamily.NotoSans.Regular};
  font-size: 13.5px;
  line-height: 22px;
  color: #999;
`;

const Cell = memo(
  ({
    record,
    index,
    ...props
  }: { record: VehicleServiceRecord; index: number } & ViewProps) => {
    return (
      <View
        {...props}
        css={`
          padding: 10px 20px;
          background-color: ${index % 2 == 0 ? '#f7f7f7' : '#fff'};
        `}
      >
        <View
          css={`
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
          `}
        >
          <Label
            css={`
              color: #333;
              font-family: ${FontFamily.NotoSans.Bold};
              font-size: 16px;
            `}
          >
            {record.mileage}公里
          </Label>
          <Label>服务顾问: {record.serviceAgentName}</Label>
        </View>
        {record.storeName ? (
          <View
            css={`
              flex-direction: row;
              align-items: center;
              flex-wrap: nowrap;
            `}
          >
            <Label>服务门店: </Label>
            <Label
              css={`
                color: #666;
              `}
              numberOfLines={1}
            >
              {record.storeName}
            </Label>
          </View>
        ) : null}
        <View
          css={`
            flex-direction: row;
            align-items: center;
            flex-wrap: nowrap;
          `}
        >
          <Label>服务日期: </Label>
          <Label
            css={`
              color: #666;
            `}
            numberOfLines={1}
          >
            {formatDateTime(record.createdAt)}
          </Label>
        </View>
        <View
          css={`
            flex-direction: row;
            align-items: flex-start;
            flex-wrap: nowrap;
            overflow: hidden;
            margin-top: 4px;
          `}
        >
          <Label
            css={`
              line-height: 18px;
            `}
          >
            服务项目:{' '}
          </Label>
          <Label
            css={`
              flex: 1;
              color: #666;
              line-height: 18px;
            `}
            numberOfLines={0}
          >
            {record.items?.map(x => x.label ?? x.name)?.join(', ') ??
              '常规保养'}
          </Label>
        </View>
      </View>
    );
  },
);

const kPlaceholderContentHeight = 150;

export const VehicleServiceInfoView = memo(
  ({
    state,
    onFetch,
  }: {
    state: AsyncState<VehicleServiceInfo | null> | undefined;
    onFetch?: () => void;
  }) => {
    // HACK!HACK!HACK!: force re-render the flat list otherwise it's not
    // scrollable initially, wired, but works.
    const [key, setKey] = useState('default');
    useEffect(() => {
      if (state?.status == 'success' && state.result) {
        const { vin, licensePlateNo } = state.result.vehicleInfo;
        console.log('update key to ', [vin, licensePlateNo].join(':'));
        setKey([vin, licensePlateNo].join(':'));
      } else {
        console.log('update key to default');
        setKey('default');
      }
    }, [state]);

    if (!state) return null;

    if (state.status === 'loading') {
      return (
        <Center
          css={`
            height: ${kPlaceholderContentHeight}px;
          `}
        >
          <ActivityIndicator />
        </Center>
      );
    }

    if (state.status === 'error') {
      return (
        <View
          css={`
            height: ${kPlaceholderContentHeight}px;
            align-items: center;
            justify-content: center;
          `}
        >
          <View
            css={`
              flex-direction: row;
              align-items: center;
              justify-content: center;
            `}
          >
            <Text
              css={`
                font-family: ${FontFamily.NotoSans.Regular};
                font-size: 14px;
                line-height: 16px;
                color: #444;
              `}
            >
              获取车辆服务信息失败,
            </Text>
            <TouchableOpacity
              onPress={onFetch}
              css={`
                margin-left: 4px;
              `}
            >
              <Text
                css={`
                  font-family: ${FontFamily.NotoSans.Regular};
                  font-size: 14px;
                  line-height: 16px;
                  color: ${StatusColors.Info};
                `}
              >
                重新获取
              </Text>
            </TouchableOpacity>
          </View>
          <View
            css={`
              margin-top: 10px;
            `}
          >
            <Text
              css={`
                font-family: ${FontFamily.NotoSans.Regular};
                font-size: 12px;
                line-height: 16px;
                color: ${StatusColors.Danger};
              `}
            >
              {state.error.message ??
                'Unknown error, please check your network connnection'}
            </Text>
          </View>
        </View>
      );
    }

    if (state.result == null) {
      return (
        <Center
          css={`
            height: ${kPlaceholderContentHeight}px;
          `}
        >
          <Text
            css={`
              font-family: ${FontFamily.NotoSans.Regular};
              font-size: 14px;
              line-height: 16px;
              color: #777;
            `}
          >
            暂无相关服务记录
          </Text>
        </Center>
      );
    }

    // const data = [
    //   ...state.result.serviceRecords,
    //   ...state.result.serviceRecords.map(x => ({ ...x, _id: x._id + 'x' })),
    //   ...state.result.serviceRecords.map(x => ({ ...x, _id: x._id + 'y' })),
    //   ...state.result.serviceRecords.map(x => ({ ...x, _id: x._id + 'z' })),
    // ];

    return (
      <>
        <VehicleInfoView
          vehicleInfo={state.result.vehicleInfo}
          serviceRecordCount={state.result.serviceRecords.length}
          hasObservers={!state.result.hasObservers}
        />
        <BottomSheetFlatList
          key={key}
          data={state.result.serviceRecords}
          initialNumToRender={10}
          keyExtractor={x => x._id}
          renderItem={({ item, index }) => <Cell record={item} index={index} />}
          contentContainerStyle={{}}
          ListFooterComponent={FooterSpacer}
        />
      </>
    );
  },
);

const FooterSpacer = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      css={`
        height: ${insets.bottom + 64}px;
      `}
    />
  );
};
