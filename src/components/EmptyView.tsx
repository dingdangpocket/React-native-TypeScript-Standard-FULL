import { FontFamily } from '@euler/components/typography';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { memo, ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'styled-components/native';

export const EmptyView = memo(
  ({
    error,
    message,
    onRetry,
  }: {
    error?: Error;
    message?: ReactNode;
    onRetry?: () => void;
  }) => {
    const theme = useTheme();
    return (
      <View
        css={`
          align-items: center;
          justify-content: center;
          flex: 1;
        `}
      >
        {error ? (
          <MaterialIcons
            name="error"
            size={48}
            color={theme.colors.status.danger}
          />
        ) : (
          <Ionicons
            name="ios-file-tray-outline"
            size={48}
            color={theme.components.emptyView.iconColor}
          />
        )}
        {message && typeof message === 'object' ? (
          message
        ) : (
          <Text
            css={`
              font-family: ${FontFamily.NotoSans.Light};
              font-size: 12px;
              color: ${error
                ? theme.colors.status.danger
                : theme.components.emptyView.textColor};
              margin-top: 8px;
            `}
          >
            {message ??
              (error ? '对不起，服务暂时不可用，请稍后重试' : '暂无相关数据')}
          </Text>
        )}
        {error && (
          <TouchableOpacity
            onPress={onRetry}
            css={`
              background-color: ${theme.components.emptyView
                .retryButtonBgColor};
              height: 28px;
              border-radius: 14px;
              justify-content: center;
              align-items: center;
              margin-top: 36px;
              padding: 5px 16px;
            `}
          >
            <Text
              css={`
                font-family: ${FontFamily.NotoSans.Light};
                font-size: 12px;
                line-height: 14px;
              `}
            >
              重试
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  },
);
