/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FontFamily } from '@euler/components/typography';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { memo } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'styled-components/native';

export const ReportTabBar = memo(
  ({
    state,
    descriptors,
    navigation,
    position,
    taskNo,
  }: MaterialTopTabBarProps & {
    taskNo: string;
  }) => {
    const theme = useTheme();
    return (
      <View
        css={`
          height: 44px;
          background-color: ${theme.report.tab.bgColor};
          elevation: 3;
          flex-direction: row;
        `}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({
                name: route.name,
                merge: true,
                params: { taskNo },
              });
            }
          };

          const inputRange = state.routes.map((_, i) => i);
          const opacity = position.interpolate({
            inputRange,
            outputRange: inputRange.map(i => (i === index ? 1 : 0.5)),
          });

          return (
            <TouchableOpacity
              key={route.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              css={`
                flex: 1;
                align-items: center;
                justify-content: center;
                border-bottom-width: 2px;
                border-bottom-color: ${isFocused
                  ? theme.report.tab.activeColor
                  : 'transparent'};
              `}
            >
              {/* @ts-ignore */}
              <Animated.Text
                css={`
                  font-family: ${isFocused
                    ? FontFamily.NotoSans.Bold
                    : FontFamily.NotoSans.Regular};
                  font-size: 16px;
                  color: ${isFocused
                    ? theme.report.tab.activeColor
                    : theme.report.tab.inactiveColor};
                `}
                style={{ opacity }}
              >
                {label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  },
);
