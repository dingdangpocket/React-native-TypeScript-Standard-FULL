import { IconProps } from '@euler/app/components/icons/types';
import { ComponentType, FC, memo } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
interface Props {
  icon: ComponentType<IconProps>;
  tag: string;
  onPress: (tag: string) => void;
}

const PreinspectionFailureAddButton: FC<Props> = memo(props => {
  const Icon = props.icon;
  return (
    <TouchableOpacity onPress={() => props.onPress?.(props.tag)}>
      <View
        css={`
          height: 60px;
          width: 60px;
          justify-content: center;
          align-items: center;
          margin-left: 2px;
        `}
      >
        <Icon />
        <Text
          css={`
            color: white;
          `}
        >
          {props.tag}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default PreinspectionFailureAddButton;
