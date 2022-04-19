import { useAppLoading } from '@euler/app/components/loading';
import { AuthNavParams } from '@euler/app/flows/auth/Auth';
import { useLogin } from '@euler/app/flows/auth/hooks';
import { FormGroup } from '@euler/components/form';
import { FontFamily } from '@euler/components/typography';
import { config } from '@euler/config';
import { wrapNavigatorScreen } from '@euler/functions';
import { MpUserInfo } from '@euler/model';
import { AuthProviderType } from '@euler/model/auth';
import { useIsMobileLayout } from '@euler/utils';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInputEndEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Toast from 'react-native-root-toast';
import { useTheme } from 'styled-components/native';
import { LoginBackButton } from '../components/BackButton';
import { CodeTtl } from '../components/CodeTtl';
import { LoginHeader } from '../components/LoginHeader';
import { LoginScreenView } from '../components/LoginScreenView';

const kCellMargin = 5;

const styles = StyleSheet.create({
  codeFieldRoot: {
    paddingHorizontal: 0,
    justifyContent: 'space-between',
  },
  codeFieldInput: {
    borderRadius: 8,
  },
});

type CodeInfo = {
  ticket: string;
  length: number;
  ttl: number;
};

export const LoginCodeScreen = wrapNavigatorScreen(
  ({
    mobile,
    provider,
    onSendCode,
    ...props
  }: {
    mobile: string;
    codeInfo: CodeInfo;
    provider?:
      | {
          type: 'phone';
        }
      | { type: 'wexin'; nonce: string; userInfo: MpUserInfo };
    onSendCode: (
      callback: (error: Error | null | undefined, result?: CodeInfo) => void,
    ) => void;
  }) => {
    const theme = useTheme();
    const isMobileLayout = useIsMobileLayout();
    const navigation = useNavigation<StackNavigationProp<AuthNavParams>>();
    const [codeInfo, setCodeInfo] = useState(props.codeInfo);
    const { length, ttl, ticket } = codeInfo;
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: length });
    const [codeFieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
      value,
      setValue,
    });
    const [isTicking, setIsTicking] = useState(true);
    const [cellSize, setCellSize] = useState(10);
    const loading = useAppLoading();
    const { login } = useLogin();

    const onTimeout = useCallback(() => {
      setIsTicking(false);
    }, []);

    const onProblemReceiveCode = useCallback(() => {
      navigation.push('_LoginCodeTips', {});
    }, [navigation]);

    const onCodeFieldLayout = useCallback(
      (e: LayoutChangeEvent) => {
        const size =
          (e.nativeEvent.layout.width - (length - 1) * 2 * kCellMargin) /
          length;
        setCellSize(size);
      },
      [length],
    );

    const onValueChange = (text: string) => {
      setValue(text);
    };

    const onResendCode = useCallback(() => {
      setValue('');
      onSendCode((error, result) => {
        if (error) return;
        setCodeInfo(result!);
        setIsTicking(true);
        ref.current?.focus();
      });
    }, [onSendCode, ref]);

    const onEditEditing = useCallback(
      async (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
        const code = e.nativeEvent.text;
        if (code.length < length) return;
        loading.show();
        try {
          if (provider?.type === 'wexin') {
            await login({
              type: AuthProviderType.Weixin,
              appId: config.weixinOpen.appId,
              nonce: provider.nonce,
              credential: {
                type: 'phone',
                phone: mobile,
                ticket,
                verifyCode: code,
              },
            });
          } else {
            await login({
              type: AuthProviderType.Phone,
              phone: mobile,
              ticket,
              verifyCode: code,
            });
          }
          loading.hide();
          Toast.show('登录成功', {
            duration: 500,
          });
        } catch (error) {
          loading.hide();
          console.error(error);
          Toast.show('登录失败\n' + (error as Error).message, {
            duration: 3000,
            position: Toast.positions.BOTTOM,
          });
        }
      },
      [length, loading, login, mobile, ticket, provider],
    );

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
            title="输入验证码"
            subTitle={`验证码已发送至${mobile}`}
          />
          <View
            css={`
              border-radius: 20px;
              margin-bottom: 32px;
            `}
          >
            <FormGroup
              css={`
                align-items: stretch;
              `}
            >
              <CodeField
                ref={ref}
                {...codeFieldProps}
                value={value}
                onChangeText={onValueChange}
                cellCount={length}
                rootStyle={styles.codeFieldRoot}
                textInputStyle={styles.codeFieldInput}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoFocus
                onLayout={onCodeFieldLayout}
                onEndEditing={onEditEditing}
                renderCell={({ index, symbol, isFocused }) => (
                  <Text
                    key={index}
                    onLayout={getCellOnLayoutHandler(index)}
                    css={`
                      margin-left: ${index === 0 ? 0 : kCellMargin}px;
                      margin-right: ${index === length - 1 ? 0 : kCellMargin}px;
                      height: ${cellSize}px;
                      width: ${cellSize}px;
                      line-height: ${cellSize - kCellMargin}px;
                      font-family: ${FontFamily.NotoSans.Medium};
                      font-size: 24px;
                      text-align: center;
                      color: ${theme.colors.primary};
                      border-radius: 5px;
                      overflow: hidden;
                      background-color: #fff;
                      elevation: 3;
                    `}
                  >
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
              <View
                css={`
                  flex-direction: row;
                  justify-content: space-between;
                  align-items: center;
                  flex-wrap: nowrap;
                  margin-top: 10px;
                `}
              >
                {isTicking ? (
                  <CodeTtl ttl={ttl} onTimeout={onTimeout} />
                ) : (
                  <TouchableOpacity onPress={onResendCode}>
                    <Text
                      css={`
                        font-family: ${FontFamily.NotoSans.Light};
                        font-size: 14px;
                        color: ${theme.link};
                      `}
                    >
                      重新获取验证码
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={onProblemReceiveCode}>
                  <Text
                    css={`
                      font-family: ${FontFamily.NotoSans.Light};
                      font-size: 14px;
                      color: ${theme.link};
                    `}
                  >
                    收不到验证码?
                  </Text>
                </TouchableOpacity>
              </View>
            </FormGroup>
          </View>
        </View>
      </LoginScreenView>
    );
  },
);
