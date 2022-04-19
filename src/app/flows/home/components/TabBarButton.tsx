import { SafeHaptics } from '@euler/utils';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FC, memo } from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#009FD4',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 5,
  },
});

const kSize = 60;

export const TabBarButton: FC<{
  onPress?: () => void;
}> = memo(({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        SafeHaptics.impact();
        onPress?.();
      }}
      style={Platform.OS === 'web' ? undefined : styles.shadow}
      css={`
        align-items: center;
        justify-content: center;
        top: -15px;
      `}
    >
      <LinearGradient
        colors={['#009FD4', '#2669db']}
        css={`
          width: ${kSize}px;
          height: ${kSize}px;
          border-radius: ${kSize / 2}px;
          align-items: center;
          justify-content: center;
        `}
        style={Platform.OS === 'web' ? styles.shadow : undefined}
      >
        <AntDesign name="plus" size={32} color="white" />
      </LinearGradient>
    </TouchableOpacity>
  );
});
