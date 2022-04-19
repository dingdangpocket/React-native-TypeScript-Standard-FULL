import { InspectionSiteGridView } from '@euler/app/flows/task/pages/inspection/components/InspectionSiteGrid';
import { Center } from '@euler/components';
import { Label } from '@euler/components/typography/Label';
import {
  useAdaptiveContainerWidth,
  useGeneralBottomSheetModal,
} from '@euler/functions';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { memo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ItemInfo } from '../functions/InspectionSiteGrid';

type Props = {
  show?: boolean;
  items: ItemInfo[];
  topMargin?: number;
  onSelect?: (item: ItemInfo) => void;
  onDismiss?: () => void;
};

export const HiddenSiteBottomSheet = memo(
  ({ show, items, onSelect, topMargin, onDismiss }: Props) => {
    const insets = useSafeAreaInsets();
    const { bottomSheetModalRef, ...bottomSheetProps } =
      useGeneralBottomSheetModal({
        show,
        topMargin,
        onDismiss,
      });
    const width = useAdaptiveContainerWidth();
    return (
      <BottomSheetModal ref={bottomSheetModalRef} {...bottomSheetProps}>
        <BottomSheetScrollView
          contentContainerStyle={{
            // flexGrow: 1,
            paddingTop: 15,
            paddingBottom: insets.bottom + 15,
          }}
        >
          {!items.length ? (
            <Center
              css={`
                padding: 32px;
              `}
            >
              <Label light size={15} color="#666">
                暂无更多部位
              </Label>
            </Center>
          ) : null}
          <InspectionSiteGridView
            width={width}
            items={items}
            onCellPress={onSelect}
          />
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);
