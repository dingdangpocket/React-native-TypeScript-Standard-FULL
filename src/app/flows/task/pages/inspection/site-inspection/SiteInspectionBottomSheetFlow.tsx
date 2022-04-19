import {
  SiteInspectionNavigator,
  SiteInspectionNavigatorContext,
  SiteInspectionNavParams,
  useSiteInspectionNavigatorContext,
} from '@euler/app/flows/task/pages/inspection/site-inspection/SiteInspectionNavigator';
import { useGeneralBottomSheetModal } from '@euler/functions';
import { useBehaviorSubject, useContextBridge } from '@euler/utils/hooks';
import { BottomSheetFooter, BottomSheetModal } from '@gorhom/bottom-sheet';
import { NavigationContainerRef } from '@react-navigation/native';
import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type SiteInspectionFlowRef = {
  navigator: NavigationContainerRef<SiteInspectionNavParams>;
  present<S extends keyof SiteInspectionNavParams>(
    screen: S,
    params: SiteInspectionNavParams[S],
  ): void;
  finish(result?: any): void;
};

export const SiteInspectionBottomSheetFlow = memo(
  forwardRef<
    SiteInspectionFlowRef,
    { onDismiss?: (result?: any) => void; onPresent?: () => void }
  >(({ onDismiss, onPresent }, ref) => {
    const [initialScreen, updateInitialScreen] = useState<{
      screen: keyof SiteInspectionNavParams;
      params?: any;
    }>();

    const finishWithResult = useRef<any>();

    const navigatorRef =
      useRef<NavigationContainerRef<SiteInspectionNavParams>>(null);

    const insets = useSafeAreaInsets();
    const { dirty$, bottomComponent$ } = useSiteInspectionNavigatorContext();
    const [isDirty, setIsDirty] = useBehaviorSubject(dirty$);
    const [bottomComponent] = useBehaviorSubject(bottomComponent$);

    const { bottomSheetModalRef, ...bottomSheetProps } =
      useGeneralBottomSheetModal({
        show: initialScreen != null,
        enableDismissOnClose: true,
        enablePanDownToClose: !isDirty,
        dismissWhenPressBackdrop: !isDirty,
        minSnapPoint: '50%',
        mediumSnapPoint: '75%',
      });

    const onInternalDismiss = useCallback(() => {
      bottomSheetModalRef.current?.dismiss();
      updateInitialScreen(undefined);
      onDismiss?.(finishWithResult.current);
      finishWithResult.current = undefined;
      setIsDirty(false);
    }, [bottomSheetModalRef, onDismiss, setIsDirty]);

    useImperativeHandle(ref, () => {
      return {
        get navigator() {
          return navigatorRef.current!;
        },
        present<S extends keyof SiteInspectionNavParams>(
          screen: S,
          params: SiteInspectionNavParams[S],
        ) {
          updateInitialScreen({ screen, params });
          onPresent?.();
        },
        finish(result?: any) {
          finishWithResult.current = result;
          if (bottomSheetModalRef.current == null) {
            onInternalDismiss();
          } else {
            bottomSheetModalRef.current.dismiss();
          }
        },
      };
    });

    const ContexBridge = useContextBridge(SiteInspectionNavigatorContext);

    const Footer = useCallback(
      (props: any) => {
        return bottomComponent ? (
          <BottomSheetFooter {...props} bottomInset={insets.bottom}>
            {bottomComponent}
          </BottomSheetFooter>
        ) : null;
      },
      [bottomComponent, insets.bottom],
    );

    if (initialScreen == null) {
      return null;
    }

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        {...bottomSheetProps}
        onDismiss={onInternalDismiss}
        footerComponent={Footer}
        handleIndicatorStyle={{
          opacity: 0,
        }}
        handleStyle={{
          padding: 0,
          height: 12,
        }}
      >
        <ContexBridge>
          <SiteInspectionNavigator
            ref={navigatorRef}
            initialScreen={initialScreen.screen}
            initialParams={initialScreen.params}
            onDismiss={onInternalDismiss}
          />
        </ContexBridge>
      </BottomSheetModal>
    );
  }),
);
