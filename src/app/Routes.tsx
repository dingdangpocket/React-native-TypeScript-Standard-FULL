import { AuthContext } from '@euler/app/flows/auth';
import { AuthScreen } from '@euler/app/flows/auth/Auth';
import { PlateNoRecognizeResultScreen } from '@euler/app/flows/common/PlateNoRecognizeResultScreen';
import { PlateNoScreen } from '@euler/app/flows/common/PlateNoScreen';
import { PlateVinScanScreen } from '@euler/app/flows/common/PlateVinScanScreen';
import { VinRecognizeResultScreen } from '@euler/app/flows/common/VinRecognizeResultScreen';
import { ErrorScreen } from '@euler/app/flows/error/Error';
import { NotFoundScreen } from '@euler/app/flows/error/NotFound';
import { HelpScreen } from '@euler/app/flows/help/Help';
import { HomeScreen } from '@euler/app/flows/home/Home';
import { AddCsutomTagScreen } from '@euler/app/flows/media/annotation/AddCustomTagScreen';
import { ImageAnnotationScreen } from '@euler/app/flows/media/annotation/ImageAnnotationScreen';
import { CameraScreen } from '@euler/app/flows/media/CameraScreen';
import { MediaPreviewScreen } from '@euler/app/flows/media/MediaPreviewScreen';
import { OrderFlow } from '@euler/app/flows/order/OrderFlow';
import { ProfileScreen } from '@euler/app/flows/profile/Profile';
import { ConstructionReportScreen } from '@euler/app/flows/report/pages/ConstructionReport';
import { DeliveryCheckReportScreen } from '@euler/app/flows/report/pages/DeliveryCheckReport';
import { InspectionReportScreen } from '@euler/app/flows/report/pages/InspectionReport';
import { PreInspectionReportScreen } from '@euler/app/flows/report/pages/PreInspectionReport';
import { ReportScreen } from '@euler/app/flows/report/pages/Report';
import { AccountSafeScreen } from '@euler/app/flows/settings/AccountSafe';
import { ChangePasswordScreen } from '@euler/app/flows/settings/ChangePassword';
import { SettingsScreen } from '@euler/app/flows/settings/Settings';
import { TaskFlow } from '@euler/app/flows/task/TaskFlow';
import { ScreenToParams, spreadScreens } from '@euler/functions';
import { PlaygroundPage } from '@euler/playground/Index';
import { safeMarkDevFlag } from '@euler/utils';
import { useBehaviorSubject } from '@euler/utils/hooks';
import { createStackNavigator } from '@react-navigation/stack';
import { memo, useContext } from 'react';
import { useTheme } from 'styled-components/native';
import BackIcon from '../assets/icons/back.svg';
import { AppDrawerNav } from './components/drawer/Nav';

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();

export const ReportScreens = {
  PreInspectionReport: PreInspectionReportScreen,
  InspectionReport: InspectionReportScreen,
  ConsturctionReport: ConstructionReportScreen,
  DeliveryCheckReport: DeliveryCheckReportScreen,
};

export const ModalScreens = {
  _mediaPreview: MediaPreviewScreen,
  _camera: CameraScreen,
  _imageAnnotation: ImageAnnotationScreen,
  _addCustomTagAnnotation: AddCsutomTagScreen,
  _plate: PlateNoScreen,
  _error: ErrorScreen,
  _vehicleInfoScanner: PlateVinScanScreen,
  _plateRecognizeResult: PlateNoRecognizeResultScreen,
  _vinRecognizeResult: VinRecognizeResultScreen,
};

export const SettingsScreens = {
  ChangePassword: ChangePasswordScreen,
  AccountSafe: AccountSafeScreen,
};

export const AppScreens = {
  Home: HomeScreen,
  NotFound: NotFoundScreen,
  Settings: SettingsScreen,
  Profile: ProfileScreen,
  Playground: PlaygroundPage,
  Help: HelpScreen,
  Order: OrderFlow,
  Task: TaskFlow,
  Report: ReportScreen,
  ...ReportScreens,
  ...ModalScreens,
  ...SettingsScreens,
};

export type AppNavParams = ScreenToParams<typeof AppScreens>;
export type ReportNavParams = ScreenToParams<typeof ReportScreens>;
export type ModalNavParams = ScreenToParams<typeof ModalScreens>;
const __playground = safeMarkDevFlag(false);

export const Routes = memo(() => {
  const authContext = useContext(AuthContext);
  const theme = useTheme();
  const [{ isAuthenticated }] = useBehaviorSubject(authContext.authState$);

  if (isAuthenticated === undefined) return null;

  return (
    <MainStack.Navigator
      screenOptions={{
        headerBackImage: () => <BackIcon />,
        headerBackTitleVisible: false,
        headerShown: false,
        cardStyle: {
          backgroundColor: theme.page.background,
        },
      }}
      initialRouteName={__playground ? 'Playground' : undefined}
    >
      {isAuthenticated ? (
        <MainStack.Group>
          <MainStack.Screen name="Root">
            {props => (
              <AppDrawerNav {...props}>
                <RootStack.Navigator
                  initialRouteName="Home"
                  screenOptions={{
                    headerBackImage: () => <BackIcon />,
                    headerBackTitleVisible: false,
                    headerShown: true,
                    cardStyle: {
                      backgroundColor: theme.page.background,
                    },
                  }}
                >
                  {spreadScreens(RootStack.Screen, AppScreens)}
                </RootStack.Navigator>
              </AppDrawerNav>
            )}
          </MainStack.Screen>
        </MainStack.Group>
      ) : (
        <MainStack.Group screenOptions={{ headerShown: false }}>
          <MainStack.Screen name="Auth" component={AuthScreen} />
        </MainStack.Group>
      )}
    </MainStack.Navigator>
  );
});
