import { Colors } from '@euler/components';
import { FontFamily } from '@euler/components/typography';
import { SafeHaptics } from '@euler/utils';
import { FC, memo, ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components/native';

export const TabBarItem: FC<{
  text: string;
  name: string;
  activeTabName: string;
  icon: (size: number, color: string) => ReactNode;
  onPress?: () => void;
}> = memo(({ text, name, activeTabName, icon, onPress }) => {
  const active = name === activeTabName;
  const theme = useTheme();
  const color = active ? theme.colors.primary : Colors.Gray2;
  return (
    <TouchableOpacity
      css={`
        align-items: center;
        justify-content: center;
      `}
      onPress={() => {
        SafeHaptics.impact();
        if (active) return;
        onPress?.();
      }}
    >
      {icon(25, color)}
      <Text
        css={`
          font-family: ${FontFamily.NotoSans.Light};
          font-size: 12px;
          color: ${color};
        `}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
});
