import { forwardRef, memo, ReactNode } from 'react';
import { ScrollView, ScrollViewProps, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModalScrollView, useIsInModalNavigation } from './ModalScrollView';

export const PanelScrollViewBottomSpacer = memo(
  (props: { bottom?: number }) => {
    const { bottom } = useSafeAreaInsets();
    return (
      <View
        css={`
          height: ${bottom + (props.bottom ?? 70)}px;
        `}
      />
    );
  },
);

export const PanelScrollView = forwardRef<
  ScrollView,
  ScrollViewProps & { children?: ReactNode; bottomHeight?: number }
>(({ children, bottomHeight, ...props }, ref) => {
  const isInModalNavigation = useIsInModalNavigation();

  if (isInModalNavigation) {
    return (
      <ModalScrollView {...props}>
        {children}
        <PanelScrollViewBottomSpacer bottom={bottomHeight} />
      </ModalScrollView>
    );
  }

  return (
    <ScrollView
      css={`
        flex: 1;
      `}
      ref={ref}
      {...props}
    >
      {children}
      <PanelScrollViewBottomSpacer bottom={bottomHeight} />
    </ScrollView>
  );
});
