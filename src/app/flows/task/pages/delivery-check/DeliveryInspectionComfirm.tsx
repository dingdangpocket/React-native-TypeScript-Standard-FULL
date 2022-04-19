import { useCurrentUser } from '@euler/app/flows/auth';
import { useTaskContext } from '@euler/app/flows/task/functions/TaskContext';
import { BottomButton } from '@euler/app/flows/task/pages/pre-inspection/components/BottomButton';
import { PreInspectionHeadCard } from '@euler/app/flows/task/pages/pre-inspection/components/PreInspectionHeadCard';
import { useVehicleYears } from '@euler/app/flows/task/pages/pre-inspection/functions/useVehicleYears';
import { AppNavParams } from '@euler/app/Routes';
import { wrapNavigatorScreen } from '@euler/functions';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

type TagItemProps = {
  title: string;
  value: string | number | undefined;
};
const BlueCard = () => {
  return (
    <View
      css={`
        height: 70px;
        background: #006be4;
      `}
    ></View>
  );
};

const TagItem = (props: TagItemProps) => {
  const { value, title } = props;
  return (
    <View
      css={`
        height: 70px;
        width: 100px;
        align-items: center;
        justify-content: center;
        margin-left: 10px;
        margin-right: 10px;
      `}
    >
      <Text
        css={`
          margin-bottom: 10px;
          font-size: 18px;
          color: #666666;
        `}
      >
        {title}
      </Text>
      <Text>{value}</Text>
    </View>
  );
};

const SeptalLine = () => {
  return (
    <View
      css={`
        height: 30px;
        border-width: 0.5px;
        border-color: gray;
      `}
    ></View>
  );
};

const InsertImage = () => {
  return (
    <View
      css={`
        justify-content: center;
        align-items: center;
      `}
    >
      <Image
        source={require('@euler/app/flows/task/assets/inspectionPic.png')}
        style={{
          width: 300,
          height: 300,
        }}
        resizeMode="contain"
      ></Image>
    </View>
  );
};
export const DeliveryInspectionComfirmScreen = wrapNavigatorScreen(
  () => {
    const navigation = useNavigation<StackNavigationProp<AppNavParams | any>>();
    const user = useCurrentUser();
    const { years } = useVehicleYears();
    const { detail } = useTaskContext();
    const { width } = useWindowDimensions();
    const onCancelDeliveryCheck = () => {
      navigation.goBack();
    };
    const onStartDeliveryCheck = () => {
      navigation.push('DeliveryInspection', {});
    };
    return (
      <View
        css={`
          flex: 1;
        `}
      >
        <ScrollView>
          <BlueCard />
          <View
            css={`
              height: 85px;
              margin-top: 35px;
              flex-direction: row;
              align-items: center;
              justify-content: center;
            `}
          >
            <TagItem title={'接车员'} value={user?.user.name}></TagItem>
            <SeptalLine />
            <TagItem title={'里程'} value={detail.vehicleMileage}></TagItem>
            <SeptalLine />
            <TagItem title={'车龄'} value={years}></TagItem>
          </View>
          <InsertImage />
          <View
            css={`
              position: absolute;
              top: 18px;
              width: ${width}px;
              height: 100px;
              justify-content: space-around;
              align-items: center;
            `}
          >
            <PreInspectionHeadCard
              vehicleName={detail.vehicleName}
              licensePlateNo={detail.licensePlateNo}
              customerWxBindings={detail.customerWxBindings}
              vehicleImageUrl={detail.vehicleImageUrl}
            />
          </View>
        </ScrollView>
        <BottomButton
          leftText={'取消交车'}
          rightText={'确认交车'}
          onLeftPress={onCancelDeliveryCheck}
          onRightPress={onStartDeliveryCheck}
        />
      </View>
    );
  },
  {
    title: '交车确认',
    titleStyle: {
      fontSize: 49,
    },
  },
);
