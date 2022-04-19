import { BlurView, BlurViewProps } from 'expo-blur';
import React, { memo } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const StatusBarBlurBackground = memo(
  ({ style, ...props }: BlurViewProps): React.ReactElement | null => {
    const insets = useSafeAreaInsets();
    if (Platform.OS !== 'ios') return null;

    return (
      <BlurView
        css={`
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          height: ${insets.top}px;
        `}
        intensity={25}
        tint="light"
        style={style}
        {...props}
      />
    );
  },
);
