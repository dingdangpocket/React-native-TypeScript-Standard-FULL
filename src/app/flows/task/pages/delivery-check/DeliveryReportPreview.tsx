import DeliveryInspectionPreviewCardList from '@euler/app/flows/task/components/DeliveryInspectionPreviewCardList';
import { WechatBindIcon } from '@euler/app/flows/task/icons/WechatBindIcon';
import { AppNavParams } from '@euler/app/Routes';
import { wrapNavigatorScreen } from '@euler/functions';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

const PreInspectionHeadCard = (props: any) => {
  const { taskDetail } = props;
  return (
    <View
      css={`
        height: 80px;
        width: 345px;
        background: white;
        border-radius: 5px;
        flex-direction: row;
      `}
    >
      <View
        css={`
          width: 240px;
          align-items: center;
          justify-content: center;
        `}
      >
        <Text
          css={`
            font-size: 16px;
          `}
        >
          {taskDetail.vehicleName}
        </Text>
        <View
          css={`
            flex-direction: row;
            margin-top: 10px;
            justify-content: space-between;
            align-items: center;
            width: 150px;
            height: 30px;
          `}
        >
          <View
            css={`
              background: #f2f2f2;
              justify-content: center;
              align-items: center;
              width: 80px;
              height: 25px;
            `}
          >
            <Text>{taskDetail.licensePlateNo}</Text>
          </View>

          <View
            css={`
              background: #3ecc82;
              flex-direction: row;
              align-items: center;
              height: 25px;
            `}
          >
            <WechatBindIcon
              size={30}
              style={{ marginRight: -10 }}
            ></WechatBindIcon>
            <Text
              css={`
                padding: 3px;
                color: white;
              `}
            >
              {taskDetail.customerWxBindings != null &&
              taskDetail.customerWxBindings.length != 0
                ? '已绑定'
                : '未绑定'}
            </Text>
          </View>
        </View>
      </View>
      <View
        css={`
          flex: 1;
          justify-content: center;
          align-items: center;
        `}
      >
        <Image
          source={{
            width: 90,
            height: 90,
            uri: taskDetail.vehicleImageUrl,
          }}
          resizeMode="contain"
        ></Image>
      </View>
    </View>
  );
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

const TagItem = (props: any) => {
  const { value, title, style } = props;
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
      style={{ ...style }}
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

const BottomButton = (props: any) => {
  const { navigation, width } = props;
  return (
    <View
      css={`
        position: absolute;
        bottom: 0px;
        width: ${width}px;
        height: 70px;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        background: white;
      `}
    >
      <TouchableOpacity
        css={`
          width: 100px;
          height: 55px;
          justify-content: center;
          align-items: center;
          border-radius: 8px;
          border-width: 1px;
          border-color: rgb(150, 150, 150);
        `}
        onPress={() => navigation.goBack()}
      >
        <Text
          css={`
            color: #cccccc;
          `}
        >
          修改报告
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        css={`
          width: 160px;
          height: 55px;
          color: white;
          background: #207fe7;
          justify-content: center;
          align-items: center;
          border-radius: 8px;
        `}
        onPress={() => navigation.goBack()}
      >
        <Text
          css={`
            color: #ffffff;
          `}
        >
          完工交车
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const DeliveryReportPreviewScreen = wrapNavigatorScreen(
  (props: any) => {
    const navigation = useNavigation<StackNavigationProp<AppNavParams>>();
    const { width } = useWindowDimensions();
    const { deliveryInputArray, taskDetail } = props;
    const [vehicleYearsMap] = useState<Map<string, any>>(
      new Map([
        ['1', 2001],
        ['2', 2002],
        ['3', 2003],
        ['4', 2004],
        ['5', 2005],
        ['6', 2006],
        ['7', 2007],
        ['8', 2008],
        ['9', 2009],
        ['A', 2010],
        ['B', 2011],
        ['C', 2012],
        ['D', 2013],
        ['E', 2014],
        ['F', 2015],
        ['G', 2016],
        ['H', 2017],
        ['J', 2018],
        ['K', 2019],
        ['L', 2020],
        ['M', 2021],
        ['N', 2022],
        ['P', 2023],
        ['R', 2024],
        ['S', 2025],
        ['T', 2026],
        ['V', 2027],
        ['W', 2028],
        ['X', 2029],
        ['Y', 2030],
      ]),
    );
    const [vehicleYears, setVehicleYears] = useState<any>();
    const useComputedVehicleYears = (vin: any) => {
      const date = new Date();
      const currentYear = date.getFullYear();
      const result = currentYear - vehicleYearsMap.get(`${vin.split('')[9]}`);
      return result;
    };
    useEffect(() => {
      setVehicleYears(useComputedVehicleYears(taskDetail.vin));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <View
        css={`
          flex: 1;
        `}
      >
        <ScrollView
          css={`
            flex: 1;
            margin-bottom: 90px;
          `}
          showsHorizontalScrollIndicator={false}
        >
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
            <TagItem
              title={'接车员'}
              value={taskDetail.preInspectedBy}
            ></TagItem>
            <SeptalLine />
            <TagItem title={'里程'} value={taskDetail.vehicleMileage}></TagItem>
            <SeptalLine />
            <TagItem title={'车龄'} value={vehicleYears}></TagItem>
          </View>
          <DeliveryInspectionPreviewCardList
            deliveryInputArray={deliveryInputArray}
          />
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
              taskDetail={taskDetail}
              width={width}
            ></PreInspectionHeadCard>
          </View>
        </ScrollView>
        <BottomButton navigation={navigation} width={width} />
      </View>
    );
  },
  {
    title: '预览报告',
    titleStyle: {
      fontSize: 49,
    },
  },
);
