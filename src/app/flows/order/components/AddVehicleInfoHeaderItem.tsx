import { Center } from '@euler/components';
import { FontFamily } from '@euler/components/typography';
import { memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components';

export const AddVehilceInfoHeaderItem = memo(
  ({ onPress }: { onPress?: () => void }) => {
    const theme = useTheme();
    return (
      <Center
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <TouchableOpacity
          onPress={onPress}
          css={`
            justify-content: center;
            align-items: center;
            padding: 0 16px;
            top: 3px;
          `}
        >
          <Text
            css={`
              color: ${theme.link};
              font-family: ${FontFamily.NotoSans.Regular};
              font-size: 14px;
              line-height: 16px;
            `}
          >
            添加
          </Text>
        </TouchableOpacity>
      </Center>
    );
  },
);
