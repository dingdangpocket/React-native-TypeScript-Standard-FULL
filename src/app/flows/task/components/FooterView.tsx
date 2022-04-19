import { FontFamily } from '@euler/components/typography';
import { memo, ReactNode } from 'react';
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from 'styled-components/native';

type Props = {
  isLoading: boolean;
  error?: Error;
  hasMore: boolean;
  style?: StyleProp<ViewStyle>;
  total: number;
  space?: number;
  onRetry?: () => void;
};

const Content = memo(
  ({
    style,
    space,
    children,
  }: {
    style?: StyleProp<ViewStyle>;
    space?: number;
    children?: ReactNode;
  }) => {
    return (
      <View
        css={`
          padding-top: 8px;
          padding-bottom: ${(space ?? 0) + 8}px;
        `}
        style={style}
      >
        <View
          css={`
            // fix the height of the footer content, otherwise, the scrollview
            // will keep firing the onendreached event once the height changes.
            height: 24px;
            justify-content: center;
            align-items: center;
          `}
        >
          {children}
        </View>
      </View>
    );
  },
);

export const FooterView = memo(
  ({ isLoading, total, error, hasMore, space, style, onRetry }: Props) => {
    const theme = useTheme();

    if (isLoading) {
      return (
        <Content space={space} style={style}>
          <ActivityIndicator
            color={theme.components.scrollView.activityIndicator.color}
          />
        </Content>
      );
    }

    if (total) {
      if (error) {
        return (
          <Content space={space} style={style}>
            <View
              css={`
                flex-direction: row;
                justify-content: center;
                align-items: center;
              `}
            >
              <Text
                css={`
                  font-family: ${FontFamily.NotoSans.Light};
                  font-size: 11px;
                  line-height: 13px;
                  color: ${theme.colors.primary};
                `}
              >
                加载数据失败，
              </Text>
              <TouchableOpacity onPress={onRetry}>
                <Text
                  css={`
                    font-family: ${FontFamily.NotoSans.Light};
                    font-size: 11px;
                    line-height: 13px;
                    color: ${theme.colors.primary};
                  `}
                >
                  重试
                </Text>
              </TouchableOpacity>
            </View>
          </Content>
        );
      }

      if (!hasMore) {
        return (
          <Content space={space} style={style}>
            <Text
              css={`
                font-family: ${FontFamily.NotoSans.Light};
                font-size: 11px;
                line-height: 13px;
                color: ${theme.components.scrollView.activityIndicator.color};
                text-align: center;
              `}
            >
              共{total}个工单，没有更多了
            </Text>
          </Content>
        );
      }
    }

    return <Content space={space} style={style} />;
  },
);
