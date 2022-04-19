import { Center } from '@euler/components';
import { Label } from '@euler/components/typography/Label';
import { FontAwesome } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from 'styled-components';

export const ItemHeaderCell = memo(
  ({
    title,
    itemNo,
    style,
    canDelete,
    onDeletePress,
  }: {
    title: string;
    itemNo: number;
    style?: StyleProp<ViewStyle>;
    canDelete?: boolean;
    onDeletePress?: () => void;
  }) => {
    const theme = useTheme();
    return (
      <View style={style}>
        <Center
          css={`
            padding: 0 20px;
            height: 40px;
          `}
        >
          <Label size={18} light>
            {title}
          </Label>
        </Center>
        <View
          css={`
            position: absolute;
            left: 15px;
            top: 0;
            bottom: 0;
            justify-content: center;
          `}
        >
          <Label size={18} medium>{`Q${itemNo}`}</Label>
        </View>
        {canDelete ? (
          <TouchableOpacity
            onPress={onDeletePress}
            css={`
              position: absolute;
              right: 0;
              top: 0;
              bottom: 0;
              justify-content: center;
              padding: 0 8px;
            `}
          >
            <FontAwesome
              name="trash-o"
              size={20}
              color={theme.colors.status.danger}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  },
);
