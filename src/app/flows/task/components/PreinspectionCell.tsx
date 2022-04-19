import { IconProps } from '@euler/app/components/icons/types';
import { ComponentType, FC, memo, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {
  leftIcon: ComponentType<IconProps>;
  title: string;
  value?: string | ComponentType<IconProps> | undefined;
  isVisible?: boolean | undefined;
  onPress?: (isVisible?: any) => void;
}

const PreinspectionCell: FC<Props> = memo(props => {
  const Icon = props.leftIcon;
  const [value, setValue] = useState<
    string | undefined | ComponentType<IconProps>
  >('');
  useEffect(() => {
    if (typeof props.value != 'object') {
      setValue(props.value);
      return;
    } else {
      const RightIcon = props.value;
      setValue(RightIcon);
      return;
    }
  }, [props]);
  return (
    <TouchableOpacity onPress={() => props.onPress?.()}>
      <View
        css={`
          height: 60px;
          align-items: center;
          justify-content: space-between;
          margin-left: 20px;
          margin-right: 10px;
          flex-direction: row;
        `}
      >
        <View
          css={`
            height: 60px;
            align-items: center;
            justify-content: space-between;
            flex-direction: row;
          `}
        >
          <Icon />
          <Text
            css={`
              color: black;
              margin-left: 10px;
            `}
          >
            {props.title}
          </Text>
        </View>
        <Text
          css={`
            font-size: 18px;
            margin-right: 7px;
          `}
        >
          {value}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default PreinspectionCell;
