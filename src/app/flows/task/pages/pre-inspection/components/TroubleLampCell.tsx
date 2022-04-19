import { MaterialIcons } from '@expo/vector-icons';
import { FC, memo, useCallback } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export type TroubleLampItem = {
  siteId: number;
  siteCode: string;
  name: string;
  icon?: string;
  checked?: boolean;
  loading?: boolean;
};

type Props = {
  item: TroubleLampItem;
  onPress?: (item: TroubleLampItem) => void;
};

export const TroubleLampCell: FC<Props> = memo(({ item, onPress }) => {
  const onCellPress = useCallback(() => {
    onPress?.(item);
  }, [item, onPress]);

  return (
    <View
      css={`
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        background: #ececec;
        height: 40px;
        margin-top: 10px;
        padding: 0 15px;
      `}
    >
      <View
        css={`
          flex: 1;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
        `}
      >
        <Image
          source={{ uri: item.icon ?? undefined }}
          css={`
            height: 30px;
            width: 30px;
            margin-right: 10px;
          `}
        />
        <Text>{item.name}</Text>
      </View>
      {item.loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <TouchableOpacity onPress={onCellPress}>
          <MaterialIcons
            name={item.checked ? 'check-box' : 'check-box-outline-blank'}
            size={24}
            color="#454546"
          />
        </TouchableOpacity>
      )}
    </View>
  );
});
