import { memo } from 'react';
import { View, ViewProps } from 'react-native';

export const Center = memo(({ style, children, ...props }: ViewProps) => {
  return (
    <View
      style={style}
      {...props}
      css={`
        justify-content: center;
        align-items: center;
      `}
    >
      {children}
    </View>
  );
});
