import {
  TroubleLampCell,
  TroubleLampItem,
} from '@euler/app/flows/task/pages/pre-inspection/components/TroubleLampCell';
import { useGeneralBottomSheetModal } from '@euler/functions';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { memo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  isVisible?: boolean;
  items: TroubleLampItem[];
  onDismiss?: () => void;
  onCellPress?: (item: TroubleLampItem) => void;
};

export const TroubleLampInspectionModal = memo(
  ({ items, isVisible, onCellPress, onDismiss }: Props) => {
    const insets = useSafeAreaInsets();
    const { bottomSheetModalRef, ...bottomSheetProps } =
      useGeneralBottomSheetModal({
        show: isVisible,
        mediumSnapPoint: '75%',
        index: 1,
        onDismiss,
      });
    return (
      <BottomSheetModal ref={bottomSheetModalRef} {...bottomSheetProps}>
        <BottomSheetFlatList
          data={items}
          keyExtractor={x => x.siteCode}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 15,
          }}
          renderItem={({ item }) => (
            <TroubleLampCell item={item} onPress={onCellPress} />
          )}
        />
      </BottomSheetModal>
    );
  },
);
