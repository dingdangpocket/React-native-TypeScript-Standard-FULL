import { wrapNavigatorScreen } from '@euler/functions';
import { Entypo } from '@expo/vector-icons';
import { memo, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

type PasswordInputProps = {
  label: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
} & Omit<TextInputProps, 'style'>;

const PasswordInput = memo(
  ({
    label,
    style,
    inputStyle,
    value,
    onChangeText,
    ...props
  }: PasswordInputProps) => {
    const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);
    return (
      <View
        css={`
          height: 60px;
          background: rgb(240, 240, 240);
          flex-direction: row;
          align-items: center;
          margin-bottom: 8px;
        `}
        style={style}
      >
        <Text
          css={`
            margin-left: 10px;
            font-size: 17px;
            margin-left: 20px;
            margin-right: 16px;
          `}
        >
          {label}
        </Text>
        <TextInput
          {...props}
          onChangeText={onChangeText}
          value={value}
          maxLength={15}
          keyboardType="numbers-and-punctuation"
          secureTextEntry={isSecureTextEntry}
          css={`
            width: 175px;
            height: 60px;
            margin: 8px;
            padding: 3px;
          `}
          style={inputStyle}
        />
        <View
          css={`
            margin-left: 25px;
          `}
        >
          <TouchableOpacity onPress={() => setIsSecureTextEntry(x => !x)}>
            <Entypo
              name={isSecureTextEntry ? 'eye-with-line' : 'eye'}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

export const ChangePasswordScreen = wrapNavigatorScreen(
  () => {
    const [phoneNumber, onChangePhoneNumber] = useState<string>('18980828915');
    const [authCode, onChangeAuthCode] = useState<string>('');
    const [newPassword, onChangeNewPassword] = useState<string>('');
    const [comfirmNewPassword, onChangeComfirmNewPassword] =
      useState<string>('');

    const [time, setTime] = useState<number>(60);
    const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
    const [btnContent, setBtnContent] = useState<string>('获取验证码');
    const [clickStatus, setClickStatus] = useState<boolean>(false);

    useEffect(() => {
      if (clickStatus == true) {
        if (time == 0) {
          setBtnContent('获取验证码');
          setBtnDisabled(false);
          return;
        }
        if (time > 0 && time < 60) {
          setBtnDisabled(true);
        }
        const interval = setInterval(() => {
          setTime(t => --t);
        }, 1000);
        setBtnContent(`${time}s后重发`);
        return () => clearInterval(interval);
      }
    }, [time, clickStatus]);

    const getAuthCode = () => {
      setTime(60);
      setClickStatus(true);
      //http request...
    };
    //when the clickStatus is true, then whatch timeValues and  set a interval decrement funtion;

    const comfirmChangePassword = () => {
      //http request...
    };

    return (
      <ScrollView
        css={`
          flex: 1;
          background: white;
        `}
      >
        <View
          css={`
            height: 60px;
            background: rgb(240, 240, 240);
            flex-direction: row;
            align-items: center;
            margin-bottom: 8px;
          `}
        >
          <Text
            css={`
              margin-left: 10px;
              font-size: 17px;
              margin-left: 20px;
            `}
          >
            登陆手机号
          </Text>
          <TextInput
            onChangeText={onChangePhoneNumber}
            value={phoneNumber}
            maxLength={11}
            keyboardType="number-pad"
            placeholder="请输入用户手机号"
            css={`
              width: 200px;
              height: 60px;
              margin: 8px;
              padding: 3px;
            `}
          />
        </View>
        <View
          css={`
            height: 60px;
            background: rgb(240, 240, 240);
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
          `}
        >
          <Text
            css={`
              margin-left: 10px;
              font-size: 17px;
              margin-left: 20px;
            `}
          >
            短信验证码
          </Text>
          <TextInput
            onChangeText={onChangeAuthCode}
            value={authCode}
            maxLength={6}
            keyboardType="number-pad"
            placeholder="请输入短信验证码"
            css={`
              width: 175px;
              height: 60px;
              margin: 8px;
              padding: 3px;
            `}
          />
          <TouchableOpacity
            css={`
              width: 70px;
              height: 32px;
              background: #0077ff;
              align-items: center;
              justify-content: center;
              border-radius: 5px;
              margin-right: 25px;
            `}
            onPress={() => getAuthCode()}
            disabled={btnDisabled}
          >
            <Text
              css={`
                font-size: 12px;
                color: white;
              `}
            >
              {btnContent}
            </Text>
          </TouchableOpacity>
        </View>

        <PasswordInput
          label="新密码"
          placeholder="输入新密码"
          onChangeText={onChangeNewPassword}
          value={newPassword}
        />

        <PasswordInput
          label="确认密码"
          placeholder="再次输入新密码"
          onChangeText={onChangeComfirmNewPassword}
          value={comfirmNewPassword}
        />

        <View
          css={`
            margin: 15px auto;
          `}
        >
          <TouchableOpacity
            css={`
              width: 330px;
              height: 47px;
              background: #0077ff;
              border-radius: 5px;
              justify-content: center;
              align-items: center;
            `}
            onPress={() => comfirmChangePassword()}
          >
            <Text
              css={`
                color: white;
              `}
            >
              确认
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  },
  {
    title: '修改密码',
  },
);
