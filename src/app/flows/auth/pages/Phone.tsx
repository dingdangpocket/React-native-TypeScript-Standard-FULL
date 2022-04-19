import { useAppLoading } from '@euler/app/components/loading';
import { AuthNavParams } from '@euler/app/flows/auth/Auth';
import { Avatar, Button, Colors } from '@euler/components';
import { FormGroup, FormInput } from '@euler/components/form';
import { FontFamily } from '@euler/components/typography';
import { wrapNavigatorScreen } from '@euler/functions';
import { MpUserInfo } from '@euler/model';
import { PredefinedVerifyCodeScene } from '@euler/model/enum';
import { useServiceFactory } from '@euler/services/factory';
import { onErrorIgnore } from '@euler/utils';
import { isMobilePhone } from '@euler/utils/validators';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { nanoid } from 'nanoid/non-secure';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-root-toast';
import { useTheme } from 'styled-components/native';
import { LoginBackButton } from '../components/BackButton';
import { LoginHeader } from '../components/LoginHeader';
import { LoginScreenView } from '../components/LoginScreenView';

const kCodeLength = 6;
const kAvatarSize = 80;
const kAvatarBorder = 5;

type Props = {
  provider?:
    | {
        type: 'phone';
      }
    | { type: 'wexin'; nonce: string; userInfo: MpUserInfo };
};

export const LoginPhoneScreen = wrapNavigatorScreen(({ provider }: Props) => {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<AuthNavParams>>();
  const loading = useAppLoading();
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const nonce = useRef(nanoid()).current;
  const [ticket, setTicket] = useState<string>();
  const { smsService } = useServiceFactory();

  useEffect(() => {
    smsService
      .requestVerifyCodeTicket(nonce)
      .then(result => {
        setTicket(result);
      })
      .catch(onErrorIgnore);
  }, [nonce, smsService]);

  const onSendCode = useCallback(
    async (
      callback?: (
        error: Error | null | undefined,
        result?: {
          ticket: string;
          length: number;
          ttl: number;
        },
      ) => void,
    ) => {
      if (!ticket) return;

      loading.show();
      setIsLoading(true);

      try {
        const ttl = await smsService.sendVerifyCode(
          ticket,
          mobile,
          PredefinedVerifyCodeScene.Login,
          kCodeLength,
        );
        setIsLoading(false);
        loading.hide();
        Toast.show('验证码已发送', {
          duration: 300,
        });
        if (callback) {
          callback(null, { ticket, length: kCodeLength, ttl });
        } else {
          navigation.push('_LoginCode', {
            mobile,
            provider,
            codeInfo: {
              ticket,
              length: kCodeLength,
              ttl,
            },
            onSendCode,
          });
        }
      } catch (e) {
        setIsLoading(false);
        loading.hide();
        Toast.show('发送失败: ' + (e as Error).message, {
          duration: 3000,
        });
        if (callback) {
          callback(e as Error);
        }
      }
    },
    [loading, mobile, navigation, smsService, ticket, provider],
  );

  const onNext = useCallback(() => {
    if (isLoading) return;
    if (!ticket) {
      Toast.show('发送失败: E_TICKET', {
        duration: 1500,
      });
      return;
    }
    onSendCode().catch(onErrorIgnore);
  }, [isLoading, onSendCode, ticket]);

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
          flex: 1;
        `}
      >
        <LoginHeader
          title={provider?.type === 'wexin' ? '绑定手机号' : '验证码登录'}
          subTitle="输入手机号并接收登录验证码"
        />
        {provider?.type === 'wexin' ? (
          <View
            css={`
              width: ${kAvatarSize + 2 * kAvatarBorder}px;
              height: ${kAvatarSize + 2 * kAvatarBorder}px;
              background-color: #fff;
              border-color: ${Colors.Gray9};
              border-width: ${kAvatarBorder}px;
              border-radius: ${(kAvatarSize + 2 * kAvatarBorder) / 2}px;
              align-self: center;
              align-items: center;
              justify-content: center;
              margin-top: 8px;
              margin-bottom: 16px;
            `}
          >
            <Avatar
              uri={provider.userInfo.headimgurl}
              name={provider.userInfo.nickname ?? ''}
              css={`
                width: ${kAvatarSize}px;
                height: ${kAvatarSize}px;
                border-radius: ${kAvatarSize / 2}px;
              `}
            />
          </View>
        ) : null}
        <View
          css={`
            border-radius: 20px;
            margin-bottom: 32px;
          `}
        >
          <FormGroup>
            <FormInput
              placeholder="手机号"
              value={mobile}
              onChange={setMobile}
              keyboardType="number-pad"
              returnKeyType="next"
              returnKeyLabel="继续"
              autoFocus
              css={`
                font-size: 16px;
                font-family: ${FontFamily.NotoSans.Medium};
                letter-spacing: 0.5px;
              `}
            />
          </FormGroup>
        </View>
      </View>
      <Button
        title="获取验证码"
        backgroundColor={theme.colors.primary}
        disabled={!isMobilePhone(mobile)}
        onPress={onNext}
        loading={isLoading}
        css={`
          margin-bottom: 32px;
          margin-left: 32px;
          margin-right: 32px;
        `}
      />
    </LoginScreenView>
  );
});
