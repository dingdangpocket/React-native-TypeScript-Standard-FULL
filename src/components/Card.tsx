import { Clickable } from '@euler/components/Clickable';
import { FontFamily } from '@euler/components/typography';
import { memo, ReactNode } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from 'styled-components/native';

export const Card = memo(
  ({
    style,
    title,
    headerStyle,
    titleTextStyle,
    headerRight,
    headerRightStyle,
    headerRightTextStyle,
    bodyStyle,
    children,
    noBodyPadding,
    onHeaderRightPress,
  }: {
    style?: StyleProp<ViewStyle>;
    title?: ReactNode;
    headerStyle?: StyleProp<ViewStyle>;
    titleTextStyle?: StyleProp<TextStyle>;
    headerRight?: ReactNode;
    headerRightStyle?: StyleProp<ViewStyle>;
    headerRightTextStyle?: StyleProp<TextStyle>;
    bodyStyle?: StyleProp<ViewStyle>;
    noBodyPadding?: boolean;
    onHeaderRightPress?: () => void;
    children?: ReactNode;
  }) => {
    const theme = useTheme();
    const flatternedStyle = StyleSheet.flatten(style);
    return (
      <View
        css={`
          // box-shadow: 0 0 15px ${theme.components.card.shadowColor};
          padding: 0;
          border-width: 0;
          border-radius: 10px;
          margin-bottom: ${flatternedStyle.marginBottom ?? 0}px;
        `}
      >
        <View
          css={`
            overflow: hidden;
            background-color: #fff;
            border-radius: 10px;
            elevation: 10;
          `}
          style={[style, { marginBottom: 0 }]}
        >
          {/* card header */}
          {title || headerRight ? (
            <View
              css={`
                padding-top: 10px;
                padding-bottom: 10px;
                padding-left: 15px;
                padding-right: 15px;
                flex-direction: row;
                justify-content: space-between;
                flex-wrap: nowrap;
                align-items: center;
                border-bottom-width: 1px;
                border-bottom-color: ${theme.components.card.borderColor};
              `}
              style={headerStyle}
            >
              <View
                css={`
                  justify-content: center;
                  flex: 1;
                `}
              >
                {typeof title === 'string' || typeof title === 'number' ? (
                  <Text
                    css={`
                      font-family: ${FontFamily.NotoSans.Regular};
                      font-size: 18px;
                      line-height: 20px;
                      color: ${theme.components.card.titleColor};
                    `}
                    style={titleTextStyle}
                  >
                    {title}
                  </Text>
                ) : (
                  title
                )}
              </View>
              {headerRight && (
                <Clickable
                  onPress={onHeaderRightPress}
                  style={headerRightStyle}
                >
                  {typeof headerRight === 'string' ||
                  typeof headerRight === 'number' ? (
                    <Text
                      css={`
                        font-family: ${FontFamily.NotoSans.Light};
                        font-size: 14px;
                        line-height: 16px;
                        color: ${onHeaderRightPress
                          ? theme.link
                          : theme.components.card.headerRightColor};
                      `}
                      style={headerRightTextStyle}
                    >
                      {headerRight}
                    </Text>
                  ) : (
                    headerRight
                  )}
                </Clickable>
              )}
            </View>
          ) : null}
          {/* card body */}
          <View
            css={`
              padding: ${noBodyPadding ? 0 : 15}px;
            `}
            style={bodyStyle}
          >
            {children}
          </View>
        </View>
      </View>
    );
  },
);
