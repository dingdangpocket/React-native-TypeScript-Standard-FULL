import { ReportTabBar } from '@euler/app/flows/report/components/ReportTabBar';
import { ReportScreens } from '@euler/app/Routes';
import { spreadScreens, wrapNavigatorScreen } from '@euler/functions';
import { VehicleReportProjection } from '@euler/model/report';
import { ReportTabKey } from '@euler/model/viewmodel';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View } from 'react-native';

const Tab = createMaterialTopTabNavigator();

export const ReportScreen = wrapNavigatorScreen(
  ({
    taskNo,
    initialTab,
  }: {
    title?: string;
    initialTab?: keyof VehicleReportProjection;
    taskNo: string;
  } & { [p in ReportTabKey]?: boolean }) => {
    return (
      <View
        css={`
          flex: 1;
        `}
      >
        <Tab.Navigator
          tabBar={props => <ReportTabBar taskNo={taskNo} {...props} />}
          screenOptions={{ lazy: true }}
        >
          {spreadScreens(
            Tab.Screen,
            ReportScreens,
            initialScreenFromInitialTab(initialTab ?? 'preInspection'),
            () => ({ taskNo }),
          )}
        </Tab.Navigator>
      </View>
    );
  },
  props => ({
    title: props.route.params.title ?? '报告详情',
  }),
);

function initialScreenFromInitialTab(
  initialTab: keyof VehicleReportProjection,
): keyof typeof ReportScreens {
  if (initialTab === 'preInspection') {
    return 'PreInspectionReport';
  }
  if (
    initialTab === 'inspection' ||
    initialTab === 'diagnostic' ||
    initialTab === 'obdInspection'
  ) {
    return 'InspectionReport';
  }
  if (initialTab === 'construction') {
    return 'ConsturctionReport';
  }
  return 'DeliveryCheckReport';
}
