import { useIsMobileLayout } from '@euler/utils';
import { useBehaviorSubject } from '@euler/utils/hooks';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  useDrawerProgress,
} from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { FC, memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { BehaviorSubject } from 'rxjs';
import { AppDrawerContent } from './Content';

const Drawer = createDrawerNavigator();

// allows for adjust the swiper gesture behavior dynamically via this
export const drawerSwiperEnabled$ = new BehaviorSubject(false);

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    overflow: 'hidden',
    shadowColor: '#FFF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 5,
  },
  drawer: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
  },
});

const DrawerScreen: FC = memo(({ children }) => {
  const progress =
    useDrawerProgress() as unknown as Animated.SharedValue<number>;
  const style = useAnimatedStyle(() => {
    return {
      borderRadius: interpolate(progress.value, [0, 1], [0, 16]),
      opacity: interpolate(progress.value, [0, 1], [1, 0.75]),
      transform: [
        {
          scale: interpolate(progress.value, [0, 1], [1, 0.8]),
        },
      ],
    };
  });
  return (
    <Animated.View style={[styles.screenContainer, style]}>
      {children}
    </Animated.View>
  );
});

const DrawContent: FC<DrawerContentComponentProps> = memo(props => {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flexGrow: 1,
        padding: 0,
      }}
      css={`
        background-color: transparent;
      `}
    >
      <AppDrawerContent {...props} />
    </DrawerContentScrollView>
  );
});

export const AppDrawerNav: FC = memo(({ children }) => {
  const isMobileLayout = useIsMobileLayout();
  const drawerStyle = useMemo(
    () => [
      styles.drawer,
      StyleSheet.create({
        drawer: {
          width: isMobileLayout ? '57%' : 300,
        },
      }).drawer,
    ],
    [isMobileLayout],
  );
  const [swipeEnabled] = useBehaviorSubject(drawerSwiperEnabled$);
  return (
    <LinearGradient
      colors={['#009FD4', '#2669db']}
      css={`
        flex: 1;
      `}
    >
      <Drawer.Navigator
        screenOptions={{
          drawerHideStatusBarOnOpen: false,
          drawerType: 'slide',
          overlayColor: 'transparent',
          drawerStyle,
          drawerContentContainerStyle: { flex: 1 },
          sceneContainerStyle: { backgroundColor: 'transparent' },
          drawerActiveBackgroundColor: 'transparent',
          drawerActiveTintColor: '#fff',
          drawerInactiveTintColor: '#fff',
          headerShown: false,
          drawerContentStyle: {
            padding: 0,
          },
          swipeEnabled,
        }}
        useLegacyImplementation={false}
        initialRouteName="Drawer"
        drawerContent={props => {
          return <DrawContent {...props} />;
        }}
      >
        <Drawer.Screen name="Drawer">
          {props => <DrawerScreen {...props}>{children}</DrawerScreen>}
        </Drawer.Screen>
      </Drawer.Navigator>
    </LinearGradient>
  );
});
