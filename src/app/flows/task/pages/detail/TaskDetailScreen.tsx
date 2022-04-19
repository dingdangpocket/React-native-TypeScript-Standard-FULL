/* eslint-disable @typescript-eslint/no-use-before-define */
import { useAppLoading } from '@euler/app/components/loading';
import { useCurrentStore } from '@euler/app/flows/auth';
import { useTaskContext } from '@euler/app/flows/task/functions/TaskContext';
import { ConstructionInfo } from '@euler/app/flows/task/pages/detail/components/ConstructionInfo';
import { InspectionInfo } from '@euler/app/flows/task/pages/detail/components/InspectionInfo';
import { PreInspectionInfo } from '@euler/app/flows/task/pages/detail/components/PreInspectionInfo';
import { TaskInfo } from '@euler/app/flows/task/pages/detail/components/TaskInfo';
import { TimelineSummary } from '@euler/app/flows/task/pages/detail/components/TimelineSummary';
import { TaskNavParams } from '@euler/app/flows/task/TaskFlow';
import { useSystemMetrics, wrapNavigatorScreen } from '@euler/functions';
import { VehicleInspectionFlow } from '@euler/model';
import { InspectionCategory } from '@euler/model/enum';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { RefreshControl, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { kHeaderHeight, kOffset } from './components/constants';
import { TaskDetailHeader, TaskDetailHeaderShade } from './components/Header';
import { TaskNavBar } from './components/TaskNavBar';

export const TaskDetailScreen = wrapNavigatorScreen(
  () => {
    const scrollY = useSharedValue(0);
    const { navBarHeight } = useSystemMetrics();
    const store = useCurrentStore();
    const { taskNo, detail, isRefreshing, fetchDetail, taskManager } =
      useTaskContext();

    const appLoading = useAppLoading();
    const navigation = useNavigation<StackNavigationProp<TaskNavParams>>();

    const onNewFlowPress = useCallback(
      (category: InspectionCategory) => {
        navigation.push('inspectionFlows', {
          category,
        });
      },
      [navigation],
    );

    const onFlowPress = useCallback(
      async (flow: VehicleInspectionFlow) => {
        if (flow.status === 'pending') {
          try {
            appLoading.show();
            await taskManager.inspectionManager.beginInspectionFlow(flow.id);
          } catch (e) {
            alert((e as Error).message);
          } finally {
            appLoading.hide();
          }
        }
        navigation.push('inspection', { flow });
      },
      [appLoading, navigation, taskManager],
    );

    return (
      <View
        css={`
          flex: 1;
        `}
      >
        <TaskDetailHeaderShade scrollY={scrollY} />

        <TaskDetailHeader
          licensePlateNo={detail.basicInfo.licensePlateNo}
          vehicleName={detail.basicInfo.vehicleName}
          vehicleImageUrl={detail.basicInfo.vehicleImageUrl}
          scrollY={scrollY}
        />

        <TaskNavBar
          taskNo={taskNo}
          licensePlateNo={detail.basicInfo.licensePlateNo}
          vehicleName={detail.basicInfo.vehicleName}
          scrollY={scrollY}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={1}
          onScroll={e => {
            'worklet';
            scrollY.value = e.nativeEvent.contentOffset.y;
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={fetchDetail}
              progressViewOffset={navBarHeight}
            />
          }
          contentContainerStyle={{
            padding: 15,
            flexGrow: 1,
            paddingTop: kHeaderHeight - kOffset,
          }}
        >
          <TaskInfo
            {...detail.basicInfo}
            storeName={store.name}
            showVehicleName={false}
            brandLogoPosition="right"
          />

          <PreInspectionInfo
            taskNo={taskNo}
            detail={detail.preInspection}
            serviceAgentName={detail.basicInfo.serviceAgentName}
          />

          <InspectionInfo
            detail={detail.inspection}
            onNewFlowPress={onNewFlowPress}
            onFlowPress={onFlowPress}
          />

          <ConstructionInfo taskNo={taskNo} detail={detail.construction} />

          <TimelineSummary taskNo={taskNo} />
        </ScrollView>
      </View>
    );
  },
  { headerShown: false },
);
