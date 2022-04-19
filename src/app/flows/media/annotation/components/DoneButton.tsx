import { StatusColors } from '@euler/components';
import { Label } from '@euler/components/typography/Label';
import { memo } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';

export const DoneButton = memo(
  ({
    text,
    style,
    onPress,
  }: {
    text: string;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
  }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        css={`
          background-color: ${StatusColors.Success};
          padding: 0px 13px;
          align-items: center;
          justify-content: center;
          border-radius: 3px;
          height: 26px;
        `}
        style={style}
      >
        <Label regular color="#fff" size={14}>
          {text}
        </Label>
      </TouchableOpacity>
    );
  },
);
