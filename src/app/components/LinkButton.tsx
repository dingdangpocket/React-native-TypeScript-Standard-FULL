import { FontFamily } from '@euler/components/typography';
import { FC, memo } from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useTheme } from 'styled-components';

export const LinkButton: FC<{
  text: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}> = memo(({ text, style, textStyle, onPress, children }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      css={`
        flex-direction: row;
        justify-content: center;
        align-items: center;
      `}
      style={style}
    >
      <Text
        css={`
          font-size: 15px;
          font-family: ${FontFamily.NotoSans.Regular};
          color: ${theme.link};
        `}
        style={textStyle}
      >
        {text}
      </Text>
      {children}
    </TouchableOpacity>
  );
});
