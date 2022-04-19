import { memo, ReactNode } from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';

export const Clickable = memo(
  ({
    style,
    children,
    onPress,
  }: {
    style?: StyleProp<ViewStyle>;
    children?: ReactNode;
    onPress?: () => void;
  }) => {
    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress} style={style}>
          {children}
        </TouchableOpacity>
      );
    }

    return <View style={style}>{children}</View>;
  },
);
