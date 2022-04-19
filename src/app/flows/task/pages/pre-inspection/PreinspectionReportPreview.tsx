import { useCurrentUser } from '@euler/app/flows/auth';
import { useTaskContext } from '@euler/app/flows/task/functions/TaskContext';
import { BottomButton } from '@euler/app/flows/task/pages/pre-inspection/components/BottomButton';
import { FacadePreviewCard } from '@euler/app/flows/task/pages/pre-inspection/components/FacadePreviewCard';
import { PreInspectionHeadCard } from '@euler/app/flows/task/pages/pre-inspection/components/PreInspectionHeadCard';
import { PreviewImageCard } from '@euler/app/flows/task/pages/pre-inspection/components/PreviewImageCard';
import { TroubleLampPreviewCell } from '@euler/app/flows/task/pages/pre-inspection/components/TroubleLampPreviewCell';
import { useVehicleYears } from '@euler/app/flows/task/pages/pre-inspection/functions/useVehicleYears';
import { TaskNavParams } from '@euler/app/flows/task/TaskFlow';
import { wrapNavigatorScreen } from '@euler/functions';
import {
  useInventory,
  useInventoryLookup,
} from '@euler/functions/useInventory';
import { CommonTaskStatus, InspectionCategory } from '@euler/model/enum';
import { useServiceFactory } from '@euler/services/factory';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useMemo } from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';

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
type TagItemProps = {
  title: string;
  value: string | number | undefined;
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

export const PreInspectionReportPreviewScreen = wrapNavigatorScreen(
  () => {
    const user = useCurrentUser();
    const { detail, fetchDetail, taskNo } = useTaskContext();
    const { taskService } = useServiceFactory();
    const navigation = useNavigation<StackNavigationProp<TaskNavParams>>();
    const { width } = useWindowDimensions();
    const [inventory] = useInventory();
    const { getSiteById } = useInventoryLookup(inventory);
    const { years } = useVehicleYears();
    useEffect(() => {
      fetchDetail(true);
      console.log('详细', detail);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const defativefacadeSite = useMemo(() => {
      return detail.inspectedSites?.filter(
        x => x.inspectionType == 3 && x.abnormalLevel == 50,
      );
    }, [detail.inspectedSites]);

    const troubleLampSites = useMemo(() => {
      const filterHasIssueSite = detail.inspectedSites?.filter(
        x => x.inspectionType == 2 && x.abnormalLevel != 10,
      );
      const afterfilterHasIssueSite = filterHasIssueSite?.map(item => {
        return getSiteById(item.siteId);
      });
      return afterfilterHasIssueSite;
    }, [detail.inspectedSites, getSiteById]);

    const onChangeReport = () => {
      if (detail.preInspectionStatus === CommonTaskStatus.Finished) {
        console.log('二次修改报告');
        const informationToUpdate = {
          preInspectionStatus: CommonTaskStatus.InProgress,
        };
        void (async () => {
          const updateRes = await taskService.updateTaskInformation(
            taskNo,
            informationToUpdate,
          );
          if (updateRes) {
            fetchDetail(true);
          }
          console.log('更新结果 ', updateRes);
        })();
      }
      if (detail.preInspectionStatus === CommonTaskStatus.InProgress) {
        navigation.goBack();
      }
    };
    const onPushReport = () => {
      navigation.push('PreInspectionPushResult', {});
      console.log(taskNo, InspectionCategory.Pre);
      // void (async () => {
      //   const finishPreInspection = await taskService.finishInspections(
      //     taskNo,
      //     InspectionCategory.Pre,
      //   );
      //   if (finishPreInspection) {
      //     fetchDetail(true);
      //     navigation.push('PreInspectionPushResult', {});
      //     console.log('结束预检 ', finishPreInspection);
      //   }
      // })();
    };

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
            <TagItem title={'接车员'} value={user?.user.name}></TagItem>
            <SeptalLine />
            <TagItem title={'里程'} value={detail.vehicleMileage}></TagItem>
            <SeptalLine />
            <TagItem title={'车龄'} value={years}></TagItem>
          </View>
          <PreviewImageCard
            title={'仪表盘信息'}
            imageUri={detail.dashboardImgUrl}
          />
          <View
            css={`
              margin-left: 20px;
              margin-right: 20px;
            `}
          >
            {troubleLampSites?.map((item: any, index: number) => {
              return (
                <TroubleLampPreviewCell
                  key={index}
                  name={item.name}
                  imageUrl={item.iconUrl}
                />
              );
            })}
          </View>

          {defativefacadeSite?.map((item: any, index: number) => {
            return <FacadePreviewCard key={index} item={item} />;
          })}
          <PreviewImageCard
            title={'客户签名'}
            imageUri={detail.preInspectionSignatureImgUrl}
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
              vehicleName={detail.vehicleName}
              licensePlateNo={detail.licensePlateNo}
              customerWxBindings={detail.customerWxBindings}
              vehicleImageUrl={detail.vehicleImageUrl}
            />
          </View>
        </ScrollView>
        <BottomButton
          leftText={'修改报告'}
          rightText={'推送报告'}
          onLeftPress={onChangeReport}
          onRightPress={onPushReport}
        />
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
