import { memo } from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from 'styled-components';

export const Separator = memo((props: ViewProps) => {
  const theme = useTheme();
  return (
    <View
      css={`
        height: 1px;
        position: absolute;
        left: 0;
        right: 0;
        border-bottom-width: 1px;
        border-bottom-color: ${theme.components.table.borderColor};
      `}
      {...props}
    />
  );
});
