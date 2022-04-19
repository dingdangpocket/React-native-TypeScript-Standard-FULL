import React, {
  FC,
  memo,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { LayoutChangeEvent, View, ViewProps } from 'react-native';

export type LayoutInfo = { width: number; height: number };

export const LayoutContext = React.createContext<LayoutInfo>(null as any);

export const useContainerLayout = () => useContext(LayoutContext);

export const LayoutProvider: FC<LayoutInfo> = memo(props => {
  const layout = useMemo(
    () => ({ width: props.width, height: props.height }),
    [props.width, props.height],
  );
  return (
    <LayoutContext.Provider value={layout}>
      {props.children}
    </LayoutContext.Provider>
  );
});

export const LayoutProviderView: FC<
  {
    fallback?: ReactNode;
    fallbackToChildren?: boolean;
    passthrough?: boolean;
    children: ReactNode | ((size: LayoutInfo) => ReactNode);
    tag?: string;
  } & ViewProps
> = memo(
  ({ fallback, children, fallbackToChildren, passthrough, tag, ...props }) => {
    const [size, setSize] = useState<LayoutInfo>();
    const onLayout = useCallback(
      (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        if (size?.width !== width || size.height !== height) {
          if (tag) {
            console.log(`[${tag}-layout] width:`, width, ', height:', height);
          }
          setSize({ width, height });
        }
      },
      [size, tag],
    );

    if (passthrough) {
      return typeof children === 'function'
        ? children({ width: 0, height: 0 })
        : children;
    }

    return (
      <View onLayout={onLayout} {...props}>
        {!size && !fallbackToChildren ? (
          fallback
        ) : (
          <LayoutProvider width={size?.width ?? 0} height={size?.height ?? 0}>
            {typeof children === 'function'
              ? children(size ?? { width: 0, height: 0 })
              : children}
          </LayoutProvider>
        )}
      </View>
    );
  },
);
