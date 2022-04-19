import { Feather } from '@expo/vector-icons';
import { memo } from 'react';
import { useTheme } from 'styled-components';

export const ListItemDisclosure = memo(
  ({ size, color }: { size?: number; color?: string }) => {
    const theme = useTheme();
    return (
      <Feather
        name="chevron-right"
        size={size ?? 24}
        color={color ?? theme.components.table.item.detailDisclosureIconColor}
      />
    );
  },
);
