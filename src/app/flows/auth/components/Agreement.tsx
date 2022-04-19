import { TVFocusable } from '@euler/components/tvos/TVFocusable';
import { FontFamily } from '@euler/components/typography';
import * as WebBrowser from 'expo-web-browser';
import { FC, memo, useCallback, useMemo } from 'react';
import { Insets, TouchableOpacity, View } from 'react-native';
import Checkbox from 'react-native-bouncy-checkbox';
import styled, { useTheme } from 'styled-components/native';

const InlineText = styled.Text`
  font-family: ${FontFamily.NotoSans.Light};
  font-size: 14px;
`;

const kInset = 16;
const CheckboxTouchable: FC = ({ children, ...props }) => {
  const hitSlop = useMemo<Insets>(
    () => ({
      left: kInset,
      top: kInset,
      right: kInset,
      bottom: kInset,
    }),
    [],
  );
  return (
    <TouchableOpacity {...props} hitSlop={hitSlop}>
      {children}
    </TouchableOpacity>
  );
};

export const LoginAgreement: FC<{
  checked: boolean;
  onChange: (value: boolean) => void;
}> = memo(props => {
  const { checked, onChange } = props;
  const theme = useTheme();

  const openWebPage = useCallback((url: string) => {
    WebBrowser.openBrowserAsync(url).catch(() => null);
  }, []);

  const onCheckboxPress = useCallback(() => {
    onChange(!checked);
  }, [onChange, checked]);

  return (
    <View
      css={`
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
      `}
    >
      <TVFocusable
        onPress={onCheckboxPress}
        color={theme.tv.focusShadeColor}
        tvStyle={{
          width: 16,
          height: 16,
          borderRadius: 8,
        }}
      >
        <Checkbox
          disableText
          disableBuiltInState
          isChecked={checked}
          fillColor={theme.colors.primary}
          onPress={onCheckboxPress}
          size={18}
          TouchableComponent={CheckboxTouchable}
        />
      </TVFocusable>
      <View
        css={`
          margin-left: 8px;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
        `}
      >
        <InlineText>同意</InlineText>
        <TVFocusable
          color={theme.tv.focusShadeColor}
          touchable
          onPress={() => {
            openWebPage('https://zhichetech.com/terms-of-use.html');
          }}
        >
          <InlineText
            css={`
              color: ${theme.colors.primary};
            `}
          >
            用户协议
          </InlineText>
        </TVFocusable>
        <InlineText>和</InlineText>
        <TVFocusable
          color={theme.tv.focusShadeColor}
          touchable
          onPress={() => {
            openWebPage('https://zhichetech.com/privacy-policy.html');
          }}
        >
          <InlineText
            css={`
              color: ${theme.colors.primary};
            `}
          >
            隐私条款
          </InlineText>
        </TVFocusable>
      </View>
    </View>
  );
});
