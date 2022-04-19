import { FC, memo } from 'react';
import {
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
type Props = {
  leftText: string;
  rightText: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
};

export const BottomButton: FC<Props> = memo(
  ({ onLeftPress, onRightPress, leftText, rightText }) => {
    const { width } = useWindowDimensions();
    return (
      <View
        css={`
          position: absolute;
          bottom: 0px;
          width: ${width}px;
          height: 90px;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
          border-top-width: 1px;
          border-color: rgb(225, 225, 225);
        `}
      >
        <TouchableOpacity
          css={`
            width: 100px;
            height: 55px;
            justify-content: center;
            align-items: center;
            border-radius: 8px;
            border-width: 1px;
            border-color: rgb(150, 150, 150);
          `}
          onPress={() => onLeftPress?.()}
        >
          <Text
            css={`
              color: #747474;
            `}
          >
            {leftText}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          css={`
            width: 160px;
            height: 55px;
            color: white;
            background: #207fe7;
            justify-content: center;
            align-items: center;
            border-radius: 8px;
          `}
          onPress={() => onRightPress?.()}
        >
          <Text
            css={`
              color: #ffffff;
            `}
          >
            {rightText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  },
);
