import { useNavigation } from '@react-navigation/core';
import { useGestureHandlerRef } from '@react-navigation/stack';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform, ScrollViewProps } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

//#region modal pan down gesture handling
export const ModalPanDownGestureContext = createContext<{
  gestureRef: any;
  navigation: any;
} | null>(null);

export const useIsInModalNavigation = () => {
  return useContext(ModalPanDownGestureContext) != null;
};

export const ModalPanDownGestureProvider = (props: { children: ReactNode }) => {
  const modalGesture = useGestureHandlerRef();
  const navigation = useNavigation();
  const value = useMemo(
    () =>
      Platform.OS === 'ios' ? { gestureRef: modalGesture, navigation } : null,
    [modalGesture, navigation],
  );
  return (
    <ModalPanDownGestureContext.Provider value={value}>
      {props.children}
    </ModalPanDownGestureContext.Provider>
  );
};
//#endregion

export const ModalScrollView = ({
  children,
  ...props
}: ScrollViewProps & { children?: ReactNode }) => {
  const { navigation } = useContext(ModalPanDownGestureContext)!;
  const [isScrollViewOnTop, setIsScrollViewOnTop] = useState(true);
  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: isScrollViewOnTop,
    });
  }, [isScrollViewOnTop, navigation]);
  return (
    <ScrollView
      scrollEventThrottle={16}
      // waitFor={isScrollViewOnTop ? gestureRef : undefined}
      {...props}
      onScroll={event => {
        setIsScrollViewOnTop(event.nativeEvent.contentOffset.y <= 0);
        props.onScroll?.(event);
      }}
    >
      {children}
    </ScrollView>
  );
};
