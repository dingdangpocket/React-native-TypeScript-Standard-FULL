import { Ionicons } from '@expo/vector-icons';
import { StackActions, useNavigation } from '@react-navigation/native';
import { memo, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';

export const useNavBack = (): (() => void) => {
  const nav = useNavigation();

  return useCallback(() => {
    nav.dispatch(StackActions.pop(1));
  }, [nav]);
};

export const BackButton = memo(props => {
  const navBack = useNavBack();

  return (
    <TouchableOpacity
      css={`
        align-items: center;
        justify-content: center;
        min-width: 44px;
        min-height: 44px;
        top: -4px;
      `}
      onPress={navBack}
    >
      {props.children ?? (
        <Ionicons name="chevron-back" size={28} color="black" />
      )}
    </TouchableOpacity>
  );
});
