import { Feather } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { memo } from 'react';
import { ViewProps } from 'react-native';

export const ListItemCheckmark = memo(
  ({ checked, ...props }: { checked?: boolean } & ViewProps) => {
    if (!checked) return null;
    return (
      <MotiView
        from={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        css={`
          flex-shrink: 0;
          flex-grow: 0;
        `}
        {...props}
      >
        <Feather name="check" size={24} color="black" />
      </MotiView>
    );
  },
);
