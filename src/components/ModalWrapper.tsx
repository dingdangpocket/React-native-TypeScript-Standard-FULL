import { useCreation, useLocalObservable } from '@euler/utils/hooks';
import { useIsFocused, useNavigation } from '@react-navigation/core';
import { NavigationAction } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AnimatePresence, MotiView } from 'moti';
import React, {
  forwardRef,
  ReactNode,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Easing } from 'react-native-reanimated';
import {
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

export interface ModalWrapperRef {
  dismiss(callback?: () => void): void;
}

export interface ModalWrapperProps {
  children?: ReactNode;
  dismissible?: boolean;
  width?: number;
  height?: number;
  backgroundColor?: string;
  onDismiss?: () => void;
}

type ModalWrapperContextProps = {
  size$: BehaviorSubject<{ width: number; height: number }>;
};

export const ModalWrapperContext =
  React.createContext<ModalWrapperContextProps>(null as any);

export const useModalWrapperSize = (size: {
  width?: number;
  height?: number;
}) => {
  const { size$ } = useContext(ModalWrapperContext);
  const isFocused = useIsFocused();
  const oldSize = useRef<typeof size$.value>();
  useEffect(() => {
    if (isFocused) {
      oldSize.current = size$.value;
      const newSize = {
        width: size.width ?? oldSize.current!.width,
        height: size.height ?? oldSize.current!.height,
      };
      size$.next(newSize);
    } else if (oldSize.current) {
      size$.next(oldSize.current!);
      oldSize.current = undefined;
    }
  }, [size$, size.height, size.width, isFocused]);
};

export const ModalWrapper = forwardRef<ModalWrapperRef, ModalWrapperProps>(
  (props, ref) => {
    const [show, setShow] = useState(true);
    const navigation = useNavigation<StackNavigationProp<any>>();
    const { top } = useSafeAreaInsets();
    const continueAction = useRef<NavigationAction>();
    const callbackRef = useRef<() => void>();

    const size$ = useCreation(
      () =>
        new BehaviorSubject({
          width: props.width ?? 375,
          height: props.height ?? 600,
        }),
      [props.height, props.width],
    );

    const size = useLocalObservable(
      size$.pipe(
        distinctUntilChanged(
          (x, y) => x.width === y.width && x.height === y.height,
        ),
      ),
      size$.value,
    );

    useImperativeHandle(
      ref,
      () => ({
        dismiss: (callback?: () => void) => {
          callbackRef.current = callback;
          setShow(false);
        },
      }),
      [],
    );

    useEffect(() => {
      if (!show) {
        return;
      }
      return navigation.addListener('beforeRemove', e => {
        e.preventDefault();
        continueAction.current = e.data.action;
        setShow(false);
      });
    }, [navigation, show]);

    const context = useMemo(() => ({ size$ }), [size$]);

    return (
      <ModalWrapperContext.Provider value={context}>
        <AnimatePresence
          onExitComplete={() => {
            if (continueAction.current != null) {
              navigation.dispatch(continueAction.current);
            } else {
              navigation.goBack();
            }
            callbackRef.current?.();
          }}
        >
          {show && (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'timing', duration: 150 }}
              exitTransition={{
                type: 'spring',
                overshootClamping: true,
              }}
              css={`
                flex: 1;
                padding-top: ${top}px;
                background-color: rgba(0, 0, 0, 0.54);
              `}
            >
              <KeyboardAvoidingView
                behavior={'padding'}
                css={`
                  flex: 1;
                  justify-content: center;
                `}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (props.dismissible) {
                      if (props.onDismiss) {
                        props.onDismiss();
                      }
                      setShow(false);
                    }
                  }}
                >
                  <View style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>
                <MotiView
                  css={`
                    margin: 30px 5px;
                    background-color: white;
                    border-radius: 15px;
                    overflow: hidden;
                    align-self: center;
                    max-width: ${size.width}px;
                    height: ${size.height}px;
                    width: 95%;
                  `}
                  from={{ translateY: 400 }}
                  animate={{ translateY: 0 }}
                  transition={{
                    type: 'timing',
                    duration: 250,
                    easing: Easing.in(Easing.linear),
                  }}
                  exit={{ translateY: 400 }}
                  exitTransition={{
                    type: 'spring',
                    overshootClamping: true,
                  }}
                >
                  <SafeAreaInsetsContext.Provider
                    value={{ top: 0, left: 0, right: 0, bottom: 0 }}
                  >
                    {props.children}
                  </SafeAreaInsetsContext.Provider>
                </MotiView>
              </KeyboardAvoidingView>
            </MotiView>
          )}
        </AnimatePresence>
      </ModalWrapperContext.Provider>
    );
  },
);
