import { useAppLoading } from '@euler/app/components/loading';
import { AuthNavParams } from '@euler/app/flows/auth/Auth';
import { LoginMethods } from '@euler/app/flows/auth/components/LoginMethods';
import { useLogin } from '@euler/app/flows/auth/hooks';
import { Button } from '@euler/components';
import { FormGroup, FormInput } from '@euler/components/form';
import { config } from '@euler/config';
import { wrapNavigatorScreen } from '@euler/functions';
import { AuthProviderType } from '@euler/model/auth';
import { makeDebug, onErrorIgnore, sha256, showAlert } from '@euler/utils';
import { isMobilePhone } from '@euler/utils/validators';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { nanoid } from 'nanoid/non-secure';
import qs from 'qs';
import { memo, useCallback, useState } from 'react';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';
import Toast from 'react-native-root-toast';
import * as WeChat from 'react-native-wechat-lib';
import { useTheme } from 'styled-components/native';
import { LoginAgreement } from '../components/Agreement';
import { LoginHeader } from '../components/LoginHeader';
import { LoginScreenView } from '../components/LoginScreenView';

const debug = makeDebug('auth:login');

const LoginForm = memo(({ style }: { style?: StyleProp<ViewStyle> }) => {
  const theme = useTheme();
  const loading = useAppLoading();
  const navigation = useNavigation<StackNavigationProp<AuthNavParams>>();
  const [mobile, setMobile] = useState('18583981192');
  const [password, setPassword] = useState('XmtNz8e9ks');
  const [isAgreed, setIsAgreed] = useState(false);

  type Field = 'mobile' | 'password';

  const [errors, setErrors] = useState<{ [p in Field]?: string }>({});

  const setFieldError = useCallback(
    (field: Field, error: string | undefined) => {
      setErrors(p => ({ ...p, [field]: error }));
    },
    [],
  );

  const ensureServiceAgreementChecked = useCallback(() => {
    if (!isAgreed) {
      showAlert('提示', '请先同意用户协议和隐私条款，然后继续!').catch(
        onErrorIgnore,
      );
      return false;
    }
    return true;
  }, [isAgreed]);

  const { isLoggingIn, login } = useLogin();

  const onLogin = useCallback(async () => {
    if (!isMobilePhone(mobile)) {
      setFieldError('mobile', '请输入正确的手机号码!');
      return;
    }
    setFieldError('mobile', undefined);

    if (!password?.trim()) {
      setFieldError('password', '请输入登录密码!');
      return;
    }
    setFieldError('password', undefined);

    if (!ensureServiceAgreementChecked()) {
      return;
    }

    const hashedPassword = await sha256(password.trim());

    await login({
      type: AuthProviderType.Password,
      userName: mobile,
      password: hashedPassword,
    });
  }, [mobile, setFieldError, password, ensureServiceAgreementChecked, login]);

  const onLoginPhone = useCallback(() => {
    if (!ensureServiceAgreementChecked()) return;
    navigation.push('_LoginPhone', {});
  }, [navigation, ensureServiceAgreementChecked]);

  const onLoginWechat = useCallback(async () => {
    if (Platform.OS === 'web') {
      showAlert('暂不支持!').catch(onErrorIgnore);
      return;
    }
    if (!ensureServiceAgreementChecked()) return;
    const nonce = nanoid(64);
    debug('weixin auth nonce: %s', nonce);
    const state = qs.stringify({ nonce });

    const errorMsgByCode = (errCode?: number | null) => {
      // https://developers.weixin.qq.com/doc/oplatform/Mobile_App/WeChat_Login/Development_Guide.html
      return errCode === -4
        ? '已拒绝授权'
        : errCode === -2
        ? '已取消授权'
        : '微信未授权';
    };
    try {
      const installed = await WeChat.isWXAppInstalled();
      if (!installed) {
        Toast.show('微信未安装', {
          duration: 1000,
          position: Toast.positions.BOTTOM,
        });
        return;
      }
      const resp = await WeChat.sendAuthRequest('snsapi_userinfo', state);
      debug('weixin login result: ', resp);
      if (!resp.code) {
        Toast.show(errorMsgByCode(resp.errCode), {
          duration: 1500,
          position: Toast.positions.BOTTOM,
        });
        return;
      }
      loading.show();
      const result = await login({
        type: AuthProviderType.Weixin,
        appId: config.weixinOpen.appId,
        nonce,
        credential: { type: 'code', code: resp.code },
      });
      loading.hide();
      if (result && result.token === '__pending__') {
        // continue with phone
        navigation.push('_LoginPhone', {
          provider: { type: 'wexin', nonce, userInfo: result.extra! },
        });
      }
    } catch (e) {
      loading.hide();
      const error = e as { name: string; code: number };
      debug('weixin login failed: ', e, typeof e, JSON.stringify(e));
      Toast.show(errorMsgByCode(error.code), {
        duration: 1500,
        position: Toast.positions.BOTTOM,
      });
    }
  }, [ensureServiceAgreementChecked, loading, login, navigation]);

  return (
    <View
      css={`
        padding: 50px 32px;
      `}
      style={style}
    >
      <LoginHeader subTitle="登录以继续" />
      <View
        css={`
          border-radius: 20px;
          margin-bottom: 32px;
        `}
      >
        <FormGroup error={errors['mobile']}>
          <FormInput
            placeholder="手机号"
            value={mobile}
            onChange={setMobile}
            keyboardType="number-pad"
          />
        </FormGroup>
        <FormGroup error={errors['password']}>
          <FormInput
            placeholder="密码"
            value={password}
            isPassword
            onChange={setPassword}
          />
        </FormGroup>
        <FormGroup>
          <LoginAgreement checked={isAgreed} onChange={setIsAgreed} />
        </FormGroup>
      </View>
      <Button
        title="登录"
        backgroundColor={theme.colors.primary}
        onPress={onLogin}
        loading={isLoggingIn}
      />
      <LoginMethods
        onLoginPhone={onLoginPhone}
        onLoginWechat={onLoginWechat}
        css={`
          margin-top: 64px;
        `}
      />
    </View>
  );
});

export const LoginScreen = wrapNavigatorScreen(() => {
  return (
    <LoginScreenView>
      <LoginForm
        css={`
          align-self: stretch;
        `}
      />
    </LoginScreenView>
  );
});
