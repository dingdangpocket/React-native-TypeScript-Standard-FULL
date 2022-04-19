import { FontFamily } from '@euler/components/typography';
import { Feather } from '@expo/vector-icons';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

export const ObserveStatus = ({
  checked,
  label,
  style,
}: {
  checked?: boolean;
  label: string;
  style?: StyleProp<ViewStyle>;
}) => {
  const color = checked ? '#00aa55' : '#ccc';
  return (
    <View
      css={`
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        color: ${color};
      `}
      style={style}
    >
      <Feather
        name="check"
        size={12}
        color={color}
        css={`
          margin-top: 1px;
        `}
      />
      <Text
        numberOfLines={1}
        css={`
          font-family: ${FontFamily.NotoSans.Light};
          font-size: 10px;
          color: ${color};
        `}
      >
        {label}
      </Text>
    </View>
  );
};
