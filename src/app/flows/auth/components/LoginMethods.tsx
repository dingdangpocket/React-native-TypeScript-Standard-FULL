import { Colors } from '@euler/components';
import { FontFamily } from '@euler/components/typography';
import { AntDesign } from '@expo/vector-icons';
import { FC, memo } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import styled from 'styled-components/native';

const kIconSize = 24;
const kIconSpace = 12;

const Line = styled.View`
  height: 1px;
  background-color: ${Colors.Gray4};
  flex: 1;
`;

const IconWrap = styled.TouchableOpacity`
  width: ${kIconSize + kIconSpace}px;
  height: ${kIconSize + kIconSpace}px;
  border-radius: ${(kIconSize + kIconSpace) / 2}px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
`;

export const LoginMethods: FC<{
  style?: StyleProp<ViewStyle>;
  onLoginPhone?: () => void;
  onLoginWechat?: () => void;
}> = memo(({ style, onLoginPhone, onLoginWechat }) => {
  return (
    <View
      css={`
        align-items: center;
      `}
      style={style}
    >
      <View
        css={`
          flex-direction: row;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
        `}
      >
        <Line />
        <Text
          css={`
            margin: 0 12px;
            color: ${Colors.Gray3};
            font-family: ${FontFamily.NotoSans.Light};
            font-size: 12px;
          `}
        >
          使用其他方式登录
        </Text>
        <Line />
      </View>
      <View
        css={`
          flex-direction: row;
          align-items: center;
          justify-content: center;
          margin-top: 12px;
        `}
      >
        <IconWrap onPress={onLoginPhone}>
          <AntDesign name="mobile1" size={kIconSize * 0.8} color="black" />
        </IconWrap>
        <IconWrap onPress={onLoginWechat}>
          <AntDesign name="wechat" size={kIconSize} color="#1AAD19" />
        </IconWrap>
      </View>
    </View>
  );
});
