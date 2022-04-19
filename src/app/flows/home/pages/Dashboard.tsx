import { TaskList } from '@euler/app/flows/task/components/TaskList';
import { AppNavParams } from '@euler/app/Routes';
import { wrapNavigatorScreen } from '@euler/functions';
import { VehicleInspectionTask } from '@euler/model/entity';
import { useIsMobileLayout } from '@euler/utils';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
export const DashboardScreen = wrapNavigatorScreen<
  Record<string, any>,
  BottomTabNavigationOptions
>(
  () => {
    const isMobile = useIsMobileLayout();
    const { height } = useWindowDimensions();
    const rows = Math.round((height - 100) / 108);
    const navigation = useNavigation<StackNavigationProp<AppNavParams>>();

    const onTaskPress = useCallback(
      (task: VehicleInspectionTask) => {
        navigation.push('Task', { taskNo: task.taskNo });
        // navigation.push('Score', {});
      },
      [navigation],
    );

    if (isMobile) {
      return (
        <TaskList
          limit={10}
          css={`
            flex: 1;
          `}
          onTaskPress={onTaskPress}
        />
      );
    }

    return (
      <TaskList
        columns={3}
        limit={rows * 3}
        css={`
          flex: 1;
        `}
        onTaskPress={onTaskPress}
      />
    );
  },
  {
    title: '门店看板',
    headerShown: false,
  },
);
