import { Button } from '@euler/components';
import { FontFamily } from '@euler/components/typography';
import { wrapNavigatorScreen } from '@euler/functions';
import { StackActions, useNavigation } from '@react-navigation/core';
import { useCallback } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon404 from './assets/404.svg';

export const NotFoundScreen = wrapNavigatorScreen(
  () => {
    const navigation = useNavigation();
    const onBack = useCallback(() => {
      navigation.dispatch(StackActions.pop());
    }, [navigation]);
    return (
      <SafeAreaView
        css={`
          flex: 1;
          justify-content: center;
          align-items: center;
        `}
      >
        <Icon404 width={350} height={200} />
        <Text
          css={`
            font-family: ${FontFamily.NotoSans.Bold};
            font-size: 32px;
            color: #3c496b;
          `}
        >
          OOPS!
        </Text>
        <Text
          css={`
            font-family: ${FontFamily.NotoSans.Regular};
            font-size: 14px;
            color: #afbec9;
            margin: 16px 32px;
          `}
        >
          对不起，你所访问的页面不存在，请稍候重试!
        </Text>
        <Button title="返回" onPress={onBack} />
      </SafeAreaView>
    );
  },
  {
    title: 'Oops!',
    headerShown: false,
  },
);
