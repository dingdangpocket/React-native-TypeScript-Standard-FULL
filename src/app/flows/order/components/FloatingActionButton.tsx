import { Center } from '@euler/components';
import { FontFamily } from '@euler/components/typography';
import { memo } from 'react';
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TouchableOpacity,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components';

const kHeight = 56;

export const FloatingActionButton = memo(
  ({
    loading,
    disabled,
    text,
    offset = 0,
    style,
    containerStyle,
    onPress,
    ...props
  }: {
    loading?: boolean;
    disabled?: boolean;
    text: string;
    offset?: number;
    containerStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
  } & ViewProps) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    return (
      <Center
        css={`
          position: absolute;
          left: 0;
          right: 0;
          bottom: ${insets.bottom + offset + 8}px;
          background-color: transparent;
        `}
        style={containerStyle}
      >
        <TouchableOpacity
          css={`
            height: ${kHeight}px;
            padding: 0 32px;
            border-radius: ${kHeight / 2}px;
            background-color: ${theme.link};
            flex-direction: row;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
            elevation: 5;
            opacity: ${disabled ? 0.75 : 1};
          `}
          disabled={disabled}
          {...props}
          onPress={onPress}
          style={style}
        >
          {loading && (
            <ActivityIndicator
              color={'white'}
              css={`
                margin-right: 5px;
              `}
            />
          )}
          <Text
            css={`
              font-family: ${FontFamily.NotoSans.Regular};
              font-size: 20px;
              text-align: center;
              color: #fff;
            `}
          >
            {text}
          </Text>
        </TouchableOpacity>
      </Center>
    );
  },
);
