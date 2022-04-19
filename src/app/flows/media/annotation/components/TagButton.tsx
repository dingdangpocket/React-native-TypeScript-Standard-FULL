import { Label } from '@euler/components/typography/Label';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { memo, ReactNode, useCallback, useEffect } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export const TagButton = memo(
  ({
    name,
    active,
    style,
    icon,
    color = 'orange',
    onPress,
  }: {
    name: string;
    active?: boolean;
    icon?: ReactNode;
    color?: string;
    style?: StyleProp<ViewStyle>;
    onPress?: (name: string) => void;
  }) => {
    const handlePress = useCallback(() => {
      onPress?.(name);
    }, [name, onPress]);

    const scale = useSharedValue(1);

    useEffect(() => {
      scale.value = active ? 1.3 : 1;
    }, [active, scale]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: withTiming(scale.value, { duration: 200 }) }],
    }));

    return (
      <Animated.View
        css={`
          min-height: 60px;
          min-width: 60px;
        `}
        style={[animatedStyle, style]}
      >
        <TouchableOpacity
          onPress={handlePress}
          css={`
            flex: 1;
            align-items: center;
            justify-content: center;
          `}
        >
          {icon ?? (
            <MaterialCommunityIcons
              name="alert-octagon"
              size={26}
              color={color}
            />
          )}
          <Label
            light
            size={13}
            color="#fff"
            css={`
              margin-top: 4px;
            `}
          >
            {name}
          </Label>
        </TouchableOpacity>
      </Animated.View>
    );
  },
);
