import { Colors } from '@euler/components';
import { FontFamily } from '@euler/components/typography';
import { wrapNavigatorScreen } from '@euler/functions';
import { useIsMobileLayout } from '@euler/utils';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { LoginBackButton } from '../components/BackButton';
import { LoginHeader } from '../components/LoginHeader';
import { LoginScreenView } from '../components/LoginScreenView';

const Tip = styled.Text`
  font-family: ${FontFamily.NotoSans.Light};
  color: ${Colors.Gray2};
  font-size: 14px;
  margin-bottom: 16px;
`;

export const LoginCodeTipsScreen = wrapNavigatorScreen(
  () => {
    const isMobileLayout = useIsMobileLayout();
    return (
      <LoginScreenView>
        <LoginBackButton
          css={`
            margin: 32px 32px;
          `}
        />
        <View
          css={`
            padding: 18px 32px;
            align-self: stretch;
            justify-content: ${isMobileLayout ? 'flex-start' : 'center'}
            flex: 1;
          `}
        >
          <LoginHeader
            title="收不到短信验证码?"
            subTitle="可能是以下原因导致的"
          />
          <View
            css={`
              border-radius: 20px;
              margin-bottom: 32px;
            `}
          >
            <Tip>
              1、由于手机安全软件拦截，验证码短信被拦截进入了垃圾箱，请尝试打开垃圾箱查看
            </Tip>
            <Tip>
              2、由于运营商通道故障造成短信发送时间延时，请耐心等候或点击重新获取验证码
            </Tip>
            <Tip>
              3、请确保您的手机是否处于能正常接收短信状态，停机、欠费或短信箱存储已满均可能导致无法接收短信
            </Tip>
            <Tip>4、请检查手机号码是否输入正确</Tip>
          </View>
        </View>
      </LoginScreenView>
    );
  },
  {
    title: '无法收到验证码',
  },
);
