/* eslint-disable @typescript-eslint/no-use-before-define */
import { drawerSwiperEnabled$ } from '@euler/app/components/drawer/Nav';
import { TabBar } from '@euler/app/flows/home/components/TabBar';
import { DashboardScreen } from '@euler/app/flows/home/pages/Dashboard';
import { HistoryScreen } from '@euler/app/flows/home/pages/History';
import { OrderContextProvider } from '@euler/app/flows/order/functions/OrderContext';
import {
  ScreenToParams,
  spreadScreens,
  wrapNavigatorScreen,
} from '@euler/functions';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
const TabNav = createBottomTabNavigator();

const TabScreens = {
  Dashboard: DashboardScreen,
  History: HistoryScreen,
};

export type HomeTabNavParams = ScreenToParams<typeof TabScreens>;

export const HomeScreen = wrapNavigatorScreen(
  () => {
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const isFocused = useIsFocused();

    useEffect(() => {
      // only enable drawer navigator swipe gesture on focused home screen
      drawerSwiperEnabled$.next(isFocused);
    }, [navigation, isFocused]);

    return (
      <OrderContextProvider>
        <TabNav.Navigator
          screenOptions={{
            tabBarShowLabel: false,
            tabBarLabelStyle: {
              height: 0,
              display: 'none',
            },
            tabBarBackground: () => (
              <View
                css={`
                  background-color: red;
                `}
              />
            ),
            tabBarStyle: {
              backgroundColor: '#ffffff',
              borderTopWidth: 0,
              borderTopColor: 'transparent',
              ...styles.shadow,
            },
          }}
          tabBar={props => <TabBar {...props} />}
        >
          {spreadScreens(TabNav.Screen, TabScreens)}
        </TabNav.Navigator>
      </OrderContextProvider>
    );
  },
  {
    title: 'Home',
    headerShown: false,
  },
);

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7f5df0',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
});
