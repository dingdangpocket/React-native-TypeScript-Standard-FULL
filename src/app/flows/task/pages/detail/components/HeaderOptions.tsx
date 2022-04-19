import { AppNavParams } from '@euler/app/Routes';
import { TaskDetail } from '@euler/model';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { memo, useEffect } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { useTaskHeaderOptions } from '../functions/useTaskHeaderOptions';

export const TaskHeaderMoreButton = memo(
  ({
    style,
    color,
    onPress,
  }: {
    color?: string;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
  }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        css={`
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
        `}
        style={style}
      >
        <Ionicons
          name="ios-ellipsis-vertical-sharp"
          size={24}
          color={color ?? 'black'}
        />
      </TouchableOpacity>
    );
  },
);

export const TaskHeaderOptions = memo(({ detail }: { detail: TaskDetail }) => {
  const { showActions } = useTaskHeaderOptions({ detail });
  const navigation = useNavigation<StackNavigationProp<AppNavParams>>();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TaskHeaderMoreButton
          css={`
            margin-right: 8px;
          `}
        />
      ),
    });
  }, [navigation, showActions]);
  return null;
});
