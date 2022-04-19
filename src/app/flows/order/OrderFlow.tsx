import { AddVehicleInfoScreen } from '@euler/app/flows/order/pages/AddVehicleInfoScreen';
import { OrderScreen } from '@euler/app/flows/order/pages/OrderScreen';
import { ServiceAgentSelectorScreen } from '@euler/app/flows/order/pages/ServiceAgentSelectorScreen';
import { VehicleBrandSelectorScreen } from '@euler/app/flows/order/pages/VehicleBrandSelectorScreen';
import { VehicleModelSelectorScreen } from '@euler/app/flows/order/pages/VehicleModelSelectorScreen';
import BackIcon from '@euler/assets/icons/back.svg';
import { ErrorFallback } from '@euler/components/error';
import { ModalWrapper } from '@euler/components/ModalWrapper';
import { MultilineHeaderTitle } from '@euler/components/MultilineHeaderTitle';
import { FontFamily } from '@euler/components/typography';
import {
  ScreenToParams,
  spreadScreens,
  wrapNavigatorScreen,
} from '@euler/functions';
import { adaptiveWrapperOptions } from '@euler/functions/navigationOptionsBuilder';
import { useIsMobileLayout } from '@euler/utils';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import * as Sentry from '@sentry/react';
import { StatusBar } from 'expo-status-bar';
import React, { memo } from 'react';
import { Platform } from 'react-native';
import {
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useTheme } from 'styled-components';

export const kDefaultModalWidth = 375;

const Stack = createStackNavigator();

export const OrderScreens = {
  _orderPage: OrderScreen,
  _serviceAgentSelector: ServiceAgentSelectorScreen,
  _vehicleBrandSelector: VehicleBrandSelectorScreen,
  _vehicleModelSelector: VehicleModelSelectorScreen,
  _addVehicleInfo: AddVehicleInfoScreen,
};

export type OrderNavParams = ScreenToParams<typeof OrderScreens>;

type Props = {
  licensePlateNo?: string;
  vin?: string;
  onSuccess?: (orderNo: string) => void;
};

const Content = memo((props: Props) => {
  const theme = useTheme();
  return (
    <Sentry.ErrorBoundary fallback={ErrorFallback}>
      <StatusBar style={'dark'} />
      <Stack.Navigator
        initialRouteName={'_orderPage'}
        screenOptions={{
          ...TransitionPresets.SlideFromRightIOS,
          headerMode: 'float',
          headerTitleAlign: 'center',
          headerBackTitle: ' ',
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: FontFamily.NotoSans.Bold,
          },
          cardStyle: { backgroundColor: theme.page.card.backgroundColor },
          headerTitle: MultilineHeaderTitle,
          headerBackImage: () => <BackIcon />,
        }}
      >
        {spreadScreens(Stack.Screen, OrderScreens, '_orderPage', props)}
      </Stack.Navigator>
    </Sentry.ErrorBoundary>
  );
});

export const OrderFlow = wrapNavigatorScreen((props: Props) => {
  const isMobile = useIsMobileLayout();
  const { bottom, top } = useSafeAreaInsets();
  if (isMobile) {
    return (
      <SafeAreaInsetsContext.Provider
        value={{
          left: 0,
          right: 0,
          top: Platform.select({ ios: 0, default: top }),
          bottom,
        }}
      >
        <Content {...props} />
      </SafeAreaInsetsContext.Provider>
    );
  }
  return (
    <ModalWrapper dismissible={true} width={kDefaultModalWidth}>
      <Content {...props} />
    </ModalWrapper>
  );
}, adaptiveWrapperOptions());
