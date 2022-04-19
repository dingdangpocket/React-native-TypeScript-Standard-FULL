import { wrapNavigatorScreen } from '@euler/functions';
import { Text, View } from 'react-native';

export const HelpScreen = wrapNavigatorScreen(
  () => {
    return (
      <View
        css={`
          flex: 1;
          align-items: center;
        `}
      >
        <Text>帮助</Text>
      </View>
    );
  },
  {
    title: '帮助',
  },
);
