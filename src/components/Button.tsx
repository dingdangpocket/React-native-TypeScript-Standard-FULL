import { FontFamily } from '@euler/components/typography/fonts';
import color from 'color';
import { memo } from 'react';
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useTheme } from 'styled-components/native';

export type ButtonProps = {
  title: string;
  loading?: boolean;
  disabled?: boolean;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
  onPress?: () => void;
};

export const Button = memo((props: ButtonProps) => {
  const theme = useTheme();
  const { disabled, loading } = props;
  const backgroundColor = disabled
    ? theme.components.button.disabledBgColor
    : props.backgroundColor ?? theme.colors.primary;
  const whiteText = disabled ? true : !color(backgroundColor).isLight();
  return (
    <TouchableOpacity
      testID={props.testID}
      onPress={props.onPress}
      disabled={props.disabled ?? loading}
      css={`
        height: 50px;
        border-radius: 25px;
        min-width: 80px;
        padding: 0 35px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background-color: ${backgroundColor};
      `}
      style={props.style}
    >
      {loading && (
        <ActivityIndicator
          css={`
            margin-left: -12px;
            margin-right: 4px;
          `}
          color={whiteText ? 'white' : 'black'}
        />
      )}
      <Text
        css={`
          font-family: ${FontFamily.NotoSans.Regular};
          font-size: 14px;
          letter-spacing: 0.34px;
          text-align: center;
          line-height: 22px;
          color: ${whiteText ? 'white' : 'black'};
          margin-right: ${loading ? '-12px' : '0px'};
        `}
        style={props.textStyle}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  );
});
