import { AuthNavParams } from '@euler/app/flows/auth/Auth';
import { useLoginLayout } from '@euler/app/flows/auth/components/LoginScreenView';
import { Colors } from '@euler/components';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { FC, memo } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';

const kSize = 32;

export const LoginBackButton: FC<{ style?: StyleProp<ViewStyle> }> = memo(
  ({ style }) => {
    const { backButtonOffset } = useLoginLayout();
    const navigation = useNavigation<StackNavigationProp<AuthNavParams>>();
    return (
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[
          style,
          {
            transform: [{ translateX: backButtonOffset }],
          },
        ]}
      >
        <SimpleLineIcons
          name="arrow-left-circle"
          size={kSize}
          color={Colors.Gray3}
        />
      </TouchableOpacity>
    );
  },
);
