import { FontFamily } from '@euler/components/typography';
import { CommonTaskStatus } from '@euler/model/enum';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

export const StatusLabel = ({
  status,
  continuable,
  style,
}: {
  status: CommonTaskStatus;
  continuable?: boolean;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View
      css={`
        padding: 0 8px;
        height: 20px;
        border-radius: 10px;
        align-items: center;
        justify-content: center;
        color: #fff;
        background-color: ${status === CommonTaskStatus.Pending
          ? '#fbb03b'
          : status === CommonTaskStatus.InProgress
          ? '#4f01bb'
          : '#00AA55'};
      `}
      style={style}
    >
      <Text
        css={`
          font-family: ${FontFamily.NotoSans.Light};
          font-size: 11px;
          line-height: 16px;
          color: #fff;
        `}
      >
        {status === CommonTaskStatus.Pending
          ? '未开始'
          : status === CommonTaskStatus.InProgress
          ? continuable
            ? '继续任务'
            : '进行中'
          : '已完成'}
      </Text>
    </View>
  );
};
