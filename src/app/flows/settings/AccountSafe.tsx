import Cell from '@euler/app/components/Cell';
import { useLogout } from '@euler/app/flows/auth/hooks';
import { PasswordIcon } from '@euler/app/flows/settings/icons/PasswordIcon';
import { PhoneIcon } from '@euler/app/flows/settings/icons/PhoneIcon';
import { WechatIconInSet } from '@euler/app/flows/settings/icons/WechatIconInSet';
import { AppNavParams } from '@euler/app/Routes';
import { wrapNavigatorScreen } from '@euler/functions';
import { onErrorIgnore } from '@euler/utils';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const AccountSafeScreen = wrapNavigatorScreen(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (props: any) => {
    const { height } = useWindowDimensions();
    const navigation = useNavigation<StackNavigationProp<AppNavParams>>();
    const logout = useLogout();
    const checkOut = () => {
      logout().catch(onErrorIgnore);
    };
    const navigateToChangePassword = () => {
      navigation.push('ChangePassword', {});
    };
    return (
      <ScrollView
        css={`
          flex: 1;
        `}
      >
        <Cell
          title={'修改密码'}
          leftIcon={PasswordIcon}
          onPress={navigateToChangePassword}
        />
        <Cell leftIcon={WechatIconInSet} title={'微信账号'} value={'-'} />
        <Cell leftIcon={PhoneIcon} title={'手机号'} value={'-'} />
        <View
          css={`
            margin-top: ${height * 0.5}px;
            align-items: center;
          `}
        >
          <TouchableOpacity
            css={`
              width: 310px;
              height: 60px;
              border: 1.1px;
              border-color: #0077ff;
              border-radius: 5px;
              justify-content: center;
              align-items: center;
            `}
            onPress={() => checkOut()}
          >
            <Text
              css={`
                color: #0077ff;
              `}
            >
              退出登陆
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  },
  {
    title: '账号安全',
  },
);
