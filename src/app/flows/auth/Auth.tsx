import {
  LoginSide,
  useLoginLayout,
} from '@euler/app/flows/auth/components/LoginScreenView';
import { LoginCodeScreen } from '@euler/app/flows/auth/pages/Code';
import { LoginCodeTipsScreen } from '@euler/app/flows/auth/pages/CodeTips';
import { LoginScreen } from '@euler/app/flows/auth/pages/Login';
import { LoginPhoneScreen } from '@euler/app/flows/auth/pages/Phone';
import {
  ScreenToParams,
  spreadScreens,
  wrapNavigatorScreen,
} from '@euler/functions';
import { createStackNavigator } from '@react-navigation/stack';
import { memo } from 'react';
import { View } from 'react-native';

const AuthStack = createStackNavigator();
export type AuthNavParams = ScreenToParams<typeof AuthScreens>;

export const AuthScreens = {
  Login: LoginScreen,
  _LoginPhone: LoginPhoneScreen,
  _LoginCode: LoginCodeScreen,
  _LoginCodeTips: LoginCodeTipsScreen,
};

export const Screens = memo(() => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {spreadScreens(AuthStack.Screen, AuthScreens)}
    </AuthStack.Navigator>
  );
});

export const AuthScreen = wrapNavigatorScreen(() => {
  const { sideWidth, isMobileLayout } = useLoginLayout();

  if (isMobileLayout) {
    return <Screens />;
  }

  return (
    <View
      css={`
        flex: 1;
        flex-direction: row;
        align-items: stretch;
        justify-content: flex-start;
      `}
    >
      <LoginSide width={sideWidth} />
      <View
        css={`
          flex: 1;
        `}
      >
        <View
          css={`
            flex: 1;
          `}
        >
          <Screens />
        </View>
      </View>
    </View>
  );
});
