import { FontFamily, Heading } from '@euler/components/typography';
import { useIsMobileLayout } from '@euler/utils';
import { FC, memo } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleProp,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

const Side = styled.View`
  background-color: ${props => props.theme.colors.primary};
`;

export const LoginSide = memo(
  ({ width, style }: { width: number; style?: StyleProp<ViewStyle> }) => {
    return (
      <Side
        css={`
          align-items: center;
          justify-content: center;
          width: ${width}px;
          padding: 15px;
        `}
        style={style}
      >
        <Heading
          text="知车"
          css={`
            font-size: 48px;
            color: #fff;
          `}
        />
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          css={`
            color: #fff;
            font-family: ${FontFamily.NotoSans.Light};
            font-size: 18px;
            letter-spacing: 0.5px;
            opacity: 0.8;
          `}
        >
          汽车后市场产业数字化技术服务专家
        </Text>
      </Side>
    );
  },
);

export const useLoginLayout = () => {
  const isMobileLayout = useIsMobileLayout();
  const { width } = useWindowDimensions();
  const sideWidth = width * 0.35;
  const formWidth = Math.min(450, width * 0.7);
  const backButtonOffset = isMobileLayout
    ? 0
    : -(width - sideWidth - formWidth) / 2;
  return { isMobileLayout, sideWidth, formWidth, width, backButtonOffset };
};

export const LoginContent: FC = memo(({ children }) => {
  const { formWidth, isMobileLayout } = useLoginLayout();
  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={10}
      css={`
        flex: 1;
      `}
    >
      <SafeAreaView
        css={`
          flex: 1;
          align-items: ${isMobileLayout ? 'stretch' : 'center'};
        `}
      >
        <View
          css={`
            flex: 1;
            width: ${isMobileLayout ? '100%' : `${formWidth}px`};
            justify-content: ${isMobileLayout ? 'flex-start' : 'center'};
          `}
        >
          {children}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
});

export const LoginScreenView: FC = memo(props => {
  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={10}
      css={`
        flex: 1;
      `}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <LoginContent>{props.children}</LoginContent>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});
