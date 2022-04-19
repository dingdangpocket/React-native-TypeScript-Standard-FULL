import { Label } from '@euler/components/typography/Label';
import { FC, memo } from 'react';
import { StyleProp, TouchableOpacity, View, ViewProps } from 'react-native';
import { useTheme } from 'styled-components';
import { DefaultTheme } from 'styled-components/native';

const HeaderButton: FC<{
  text?: string;
  color?: string | ((theme: DefaultTheme) => string);
  style?: StyleProp<ViewProps>;
  onPress?: () => void;
}> = memo(({ style, text, color, onPress, children }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      css={`
        height: 28px;
        border-radius: 4px;
        border-width: 1px;
        border-color: ${theme.inspection.siteGrid.headerButtonBorderColor};
        background-color: ${theme.inspection.siteGrid.headerButtonColor};
        padding: 3px 9px;
        margin-left: 5px;
      `}
      style={style}
      onPress={onPress}
    >
      {text ? (
        <Label
          color={p =>
            typeof color === 'function' ? color(p) : color ?? p.link
          }
          size={13}
          regular
        >
          {text}
        </Label>
      ) : null}
      {children}
    </TouchableOpacity>
  );
});

export const InspectionSiteGridHeader = memo(
  ({
    groupId,
    name,
    onMorePress,
    onBatchNormalPress,
  }: {
    groupId: string;
    name: string;
    onMorePress?: (groupId: string) => void;
    onBatchNormalPress?: (groupId: string) => void;
  }) => {
    const theme = useTheme();
    return (
      <View
        css={`
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          height: 52px;
          background-color: ${theme.inspection.siteGrid.headerBgColor};
          padding: 0 15px;
        `}
      >
        <Label
          size={20}
          regular
          css={`
            flex: 1;
          `}
          color={p => p.inspection.siteGrid.headerTextColor}
        >
          {name}
        </Label>
        <HeaderButton
          text="批量正常"
          color={p => p.colors.status.success}
          onPress={() => onBatchNormalPress?.(groupId)}
        />
        <HeaderButton text="更多" onPress={() => onMorePress?.(groupId)} />
      </View>
    );
  },
);
