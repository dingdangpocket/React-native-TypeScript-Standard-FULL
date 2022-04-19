import { AppNavigationProvider } from '@euler/app/components/AppNavigationProvider';
import { LayoutProviderView } from '@euler/app/components/layout/LayoutProvider';
import { FontFamily } from '@euler/components/typography';
import {
  ScreenToParams,
  spreadScreens,
  useTrackNavigator,
} from '@euler/functions';
import { useCreation } from '@euler/utils/hooks';
import {
  NavigationContainer,
  NavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';
import {
  createContext,
  FC,
  forwardRef,
  memo,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { BackHandler } from 'react-native';
import { BehaviorSubject } from 'rxjs';
import { useTheme } from 'styled-components';
import { BackButton } from './BackButton';
import { NavHeaderTitle } from './NavHeaderTitle';
import { SiteInspectionFlowRef } from './SiteInspectionBottomSheetFlow';
import { SiteInspectionScreen } from './SiteInspectionScreen';

const SiteInspectionScreens = {
  _siteInspection: SiteInspectionScreen,
};

export type SiteInspectionNavParams = ScreenToParams<
  typeof SiteInspectionScreens
>;

const Stack = createStackNavigator<SiteInspectionNavParams>();

const screenOptions: StackNavigationOptions = {
  ...TransitionPresets.SlideFromRightIOS,
  headerShown: true,
  headerBackTitle: '',
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontSize: 18,
    fontFamily: FontFamily.NotoSans.Regular,
    fontWeight: '400',
  },
  headerStatusBarHeight: 0,
  headerStyle: {
    height: 44,
    elevation: 0,
    borderBottomWidth: 0,
  },
  headerTitle: NavHeaderTitle,
  headerLeft: () => <BackButton />,
  cardStyle: {
    overflow: 'visible',
  },
};

type SiteInspectionNavigatorContextProps = {
  siteInspectionFlow: RefObject<SiteInspectionFlowRef>;
  bottomComponent$: BehaviorSubject<ReactNode | undefined>;
  dirty$: BehaviorSubject<boolean>;
};

export const SiteInspectionNavigatorContext =
  createContext<SiteInspectionNavigatorContextProps>(null as any);

export const useSiteInspectionNavigatorContext = () => {
  return useContext(SiteInspectionNavigatorContext);
};

export const SiteInspectionNavigatorContextProvider: FC = memo(
  ({ children }) => {
    const siteInspectionFlow = useRef<SiteInspectionFlowRef>(null);
    const dirty$ = useCreation(() => new BehaviorSubject(false), []);
    const bottomComponent$ = useCreation(
      () => new BehaviorSubject<ReactNode | undefined>(undefined),
      [],
    );
    const value = useMemo(
      () => ({ siteInspectionFlow, dirty$, bottomComponent$ }),
      [siteInspectionFlow, dirty$, bottomComponent$],
    );
    return (
      <SiteInspectionNavigatorContext.Provider value={value}>
        {children}
      </SiteInspectionNavigatorContext.Provider>
    );
  },
);

export const SiteInspectionNavigator = memo(
  forwardRef<
    NavigationContainerRef<SiteInspectionNavParams>,
    {
      initialScreen: keyof SiteInspectionNavParams;
      initialParams?: any;
      onDismiss?: () => void;
    }
  >((props, forwardedRef) => {
    const theme = useTheme();
    const { ref, onStateChange, onReady } = useTrackNavigator(
      'site-inspection/',
      forwardedRef as any,
    );

    useEffect(() => {
      const onBackPressed = () => {
        ref.current?.dispatch(StackActions.pop());
        return true;
      };
      const listener = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPressed,
      );
      return () => listener.remove();
    }, [ref]);

    return (
      <AppNavigationProvider>
        <LayoutProviderView
          fallbackToChildren
          css={`
            flex: 1;
          `}
        >
          <NavigationContainer
            documentTitle={{ enabled: false }}
            ref={ref}
            onReady={onReady}
            onStateChange={onStateChange}
            independent={true}
            onUnhandledAction={action => {
              if (action.type === 'POP') {
                props.onDismiss?.();
              }
            }}
          >
            <Stack.Navigator
              screenOptions={{
                ...screenOptions,
                cardStyle: {
                  overflow: 'visible',
                  backgroundColor: theme.page.background,
                },
              }}
              initialRouteName={props.initialScreen}
            >
              {spreadScreens(
                Stack.Screen,
                SiteInspectionScreens,
                props.initialScreen,
                props.initialParams,
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </LayoutProviderView>
      </AppNavigationProvider>
    );
  }),
);
