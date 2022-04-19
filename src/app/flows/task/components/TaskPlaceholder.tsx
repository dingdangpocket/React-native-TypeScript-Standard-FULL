import { Center, Colors } from '@euler/components';
import { FontFamily } from '@euler/components/typography';
import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Text } from 'react-native';

export const TaskPlaceholder = memo(() => {
  return (
    <Center
      css={`
        flex: 1;
        background-color: #ddd;
      `}
    >
      <Ionicons name="ios-file-tray-outline" size={48} color={Colors.Gray3} />
      <Text
        css={`
          font-family: ${FontFamily.NotoSans.Light};
          font-size: 12px;
          color: ${Colors.Gray3};
          margin-top: 8px;
        `}
      >
        选择工单查看详情
      </Text>
    </Center>
  );
});
