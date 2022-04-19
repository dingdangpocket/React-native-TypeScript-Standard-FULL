import { memo, ReactNode } from 'react';
import {
  Platform,
  StyleProp,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

export const TVFocusable = memo(
  ({
    children,
    style,
    tvStyle,
    color,
    touchable,
    onPress,
  }: {
    style?: StyleProp<ViewStyle>;
    tvStyle?: StyleProp<ViewStyle>;
    onPress?: () => void;
    children?: ReactNode;
    color?: string;
    touchable?: boolean;
  }) => {
    // https://github.com/facebook/react-native/issues/31391
    // https://github.com/react-native-tvos/react-native-tvos
    // https://github.com/react-native-tvos/react-native-tvos/issues/240
    if (Platform.isTV) {
      return (
        <View style={[style, tvStyle, { overflow: 'hidden' }]}>
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(color ?? '#fff', false)}
            onPress={() => {
              onPress?.();
            }}
            css={`
              flex: 1;
            `}
          >
            <View>{children}</View>
          </TouchableNativeFeedback>
        </View>
      );
    }
    if (touchable) {
      return (
        <TouchableOpacity style={style} onPress={onPress}>
          {children}
        </TouchableOpacity>
      );
    }
    return <View style={style}>{children}</View>;
  },
);
