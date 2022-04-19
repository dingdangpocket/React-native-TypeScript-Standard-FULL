import { Center } from '@euler/components';
import { wrapNavigatorScreen } from '@euler/functions';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

export const HistoryScreen = wrapNavigatorScreen<
  Record<string, any>,
  BottomTabNavigationOptions
>(
  () => {
    return (
      <Center
        css={`
          flex: 1;
        `}
      >
        <Text>History Tasks List</Text>
      </Center>
    );
  },
  {
    title: '历史看板',
  },
);
