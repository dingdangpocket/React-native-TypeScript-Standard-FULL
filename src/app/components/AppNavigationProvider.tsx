import { AppNavParams } from '@euler/app/Routes';
import {
  NavigationRouteContext,
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { createContext, memo, ReactNode, useContext, useMemo } from 'react';

type AppNavigationParams = AppNavParams;

export const AppNavigationContext = createContext<{
  navigation: StackNavigationProp<AppNavigationParams>;
  route: RouteProp<AppNavigationParams>;
}>(null as any);

export const AppNavigationProvider = memo((props: { children: ReactNode }) => {
  const navigation = useNavigation<StackNavigationProp<AppNavigationParams>>();
  const route = useContext(
    NavigationRouteContext,
  ) as RouteProp<AppNavigationParams>;
  const context = useMemo(() => ({ navigation, route }), [navigation, route]);
  return (
    <AppNavigationContext.Provider value={context}>
      {props.children}
    </AppNavigationContext.Provider>
  );
});

export const useAppNavigation = <
  T extends ParamListBase = AppNavigationParams,
>() => {
  const rootNav = useContext(AppNavigationContext)
    ?.navigation as StackNavigationProp<T>;
  const navigation = useNavigation<StackNavigationProp<T>>();
  return rootNav ?? navigation;
};

export const useAppRoute = (): RouteProp<AppNavigationParams> => {
  const rootRoute = useContext(AppNavigationContext)?.route;
  const route = useRoute<RouteProp<AppNavigationParams>>();
  return rootRoute ?? route;
};
