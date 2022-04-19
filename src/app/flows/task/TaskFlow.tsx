import { AppNavigationProvider } from '@euler/app/components/AppNavigationProvider';
import { LayoutProviderView } from '@euler/app/components/layout/LayoutProvider';
import {
  getTaskResourceNamespace,
  TaskContextProvider,
} from '@euler/app/flows/task/functions/TaskContext';
import { DeliveryInspectionScreen } from '@euler/app/flows/task/pages/delivery-check/DeliveryInspection';
import { DeliveryInspectionComfirmScreen } from '@euler/app/flows/task/pages/delivery-check/DeliveryInspectionComfirm';
import { DeliveryReportPreviewScreen } from '@euler/app/flows/task/pages/delivery-check/DeliveryReportPreview';
import { InspectionFlowsScreen } from '@euler/app/flows/task/pages/detail/InspectionFlowsScreen';
import { TaskDetailScreen } from '@euler/app/flows/task/pages/detail/TaskDetailScreen';
import { InspectionSiteSearchScreen } from '@euler/app/flows/task/pages/inspection/InspectionSiteSearchScreen';
import { TaskInspectionScreen } from '@euler/app/flows/task/pages/inspection/TaskInspectionScreen';
import { PreInspectionScreen } from '@euler/app/flows/task/pages/pre-inspection/PreInspection';
import { PreInspectionComfirmScreen } from '@euler/app/flows/task/pages/pre-inspection/PreInspectionComfirm';
import { PreInspectionFailurePreviewScreen } from '@euler/app/flows/task/pages/pre-inspection/PreinspectionFailurePreview';
import { PreInspectionPushResultScreen } from '@euler/app/flows/task/pages/pre-inspection/PreInspectionPushResult';
import { PreInspectionReportPreviewScreen } from '@euler/app/flows/task/pages/pre-inspection/PreinspectionReportPreview';
import { PreInspectionSignatureScreen } from '@euler/app/flows/task/pages/pre-inspection/PreInspectionSignature';
import { QrcodeSharingScreen } from '@euler/app/flows/task/pages/QrcodeSharing';
import { TaskTimelineScreen } from '@euler/app/flows/task/pages/Timeline';
import BackIcon from '@euler/assets/icons/back.svg';
import { ErrorFallback } from '@euler/components/error';
import { ModalWrapper } from '@euler/components/ModalWrapper';
import { MultilineHeaderTitle } from '@euler/components/MultilineHeaderTitle';
import { FontFamily } from '@euler/components/typography';
import {
  adaptiveWrapperOptions,
  ScreenToParams,
  spreadScreens,
  wrapNavigatorScreen,
} from '@euler/functions';
import { useIsMobileLayout } from '@euler/utils';
import { ScopedObservableSuspenseResourceContextProvider } from '@euler/utils/hooks';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import * as Sentry from '@sentry/react';
import { StatusBar } from 'expo-status-bar';
import { memo } from 'react';
import { useTheme } from 'styled-components';

export const kDefaultModalWidth = 375;

const Stack = createStackNavigator();

export const TaskScreens = {
  taskDetail: TaskDetailScreen,
  timeline: TaskTimelineScreen,
  qrcodeSharing: QrcodeSharingScreen,
  inspectionFlows: InspectionFlowsScreen,
  inspection: TaskInspectionScreen,
  PreInspection: PreInspectionScreen,
  PreInspectionComfirm: PreInspectionComfirmScreen,
  PreinspectionFailurePreview: PreInspectionFailurePreviewScreen,
  PreinspectionReportPreview: PreInspectionReportPreviewScreen,
  PreInspectionSignature: PreInspectionSignatureScreen,
  PreInspectionPushResult: PreInspectionPushResultScreen,
  DeliveryInspection: DeliveryInspectionScreen,
  DeliveryInspectionComfirm: DeliveryInspectionComfirmScreen,
  DeliveryReportPreview: DeliveryReportPreviewScreen,
  _inspectionSiteSearch: InspectionSiteSearchScreen,
};

export type TaskNavParams = ScreenToParams<typeof TaskScreens>;

type Props = {
  taskNo: string;
};

const Content = memo((props: Props) => {
  const theme = useTheme();
  const resourceNamespace = getTaskResourceNamespace(props.taskNo);
  return (
    <AppNavigationProvider>
      <LayoutProviderView fallbackToChildren style={{ flex: 1 }}>
        <Sentry.ErrorBoundary fallback={ErrorFallback}>
          <ScopedObservableSuspenseResourceContextProvider
            scope={resourceNamespace}
          >
            <TaskContextProvider taskNo={props.taskNo}>
              <BottomSheetModalProvider>
                <StatusBar style={'dark'} />
                <Stack.Navigator
                  initialRouteName={'taskDetail'}
                  screenOptions={{
                    ...TransitionPresets.SlideFromRightIOS,
                    headerMode: 'float',
                    headerTitleAlign: 'center',
                    headerBackTitle: ' ',
                    headerTitleStyle: {
                      fontSize: 18,
                      fontFamily: FontFamily.NotoSans.Bold,
                    },
                    cardStyle: {
                      backgroundColor: theme.page.card.backgroundColor,
                    },
                    headerTitle: MultilineHeaderTitle,
                    headerBackImage: () => <BackIcon />,
                  }}
                >
                  {spreadScreens(
                    Stack.Screen,
                    TaskScreens,
                    'taskDetail',
                    props,
                  )}
                </Stack.Navigator>
              </BottomSheetModalProvider>
            </TaskContextProvider>
          </ScopedObservableSuspenseResourceContextProvider>
        </Sentry.ErrorBoundary>
      </LayoutProviderView>
    </AppNavigationProvider>
  );
});

export const TaskFlow = wrapNavigatorScreen(
  (props: Props) => {
    const isMobile = useIsMobileLayout();
    if (isMobile) {
      return <Content {...props} />;
    }
    return (
      <ModalWrapper dismissible={true} width={kDefaultModalWidth}>
        <Content {...props} />
      </ModalWrapper>
    );
  },
  adaptiveWrapperOptions({
    presentation: undefined,
    headerStatusBarHeight: undefined,
  }),
);
