import { IconProps } from '@euler/app/components/icons/types';
import { AntDesign } from '@expo/vector-icons';
import { ComponentType, FC, memo } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {
  leftIcon: ComponentType<IconProps>;
  title: string;
  value?: string | number | undefined;
  tag?: any;
  onPress?: (tag?: any) => void;
}

const Cell: FC<Props> = memo(props => {
  const Icon = props.leftIcon;
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => props.onPress?.(props.tag)}
    >
      <View
        css={`
          height: 60px;
          background: rgb(245, 245, 245);
          align-items: center;
          justify-content: space-between;
          flex-direction: row;
          margin-bottom: 5px;
          flex-wrap: nowrap;
        `}
      >
        <View
          css={`
            height: 60px;
            align-items: center;
            justify-content: flex-start;
            flex-direction: row;
            padding-left: 15px;
          `}
        >
          <Icon size={40} />
          <Text
            css={`
              margin-right: 20px;
              font-size: 14px;
              margin-left: 5px;
            `}
          >
            {props.title}
          </Text>
        </View>
        <View
          css={`
            height: 60px;
            width: 160px;
            align-items: center;
            justify-content: flex-end;
            flex-direction: row;
          `}
        >
          <Text
            css={`
              font-size: 14px;
              margin-right: 5px;
            `}
          >
            {props.value}
          </Text>
          <AntDesign
            name="right"
            size={20}
            color="gray"
            css={`
              margin-right: 8px;
            `}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default Cell;
