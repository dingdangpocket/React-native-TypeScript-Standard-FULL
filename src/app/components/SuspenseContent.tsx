import { useRetryOnError } from '@euler/app/flows/task/functions/useRetryOnError';
import { EmptyView } from '@euler/components/EmptyView';
import { ErrorBoundary } from '@sentry/react';
import { ComponentType, FC, memo, Suspense } from 'react';
import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native';

type Props = {
  resourceId: string;
  errorMsg?: string;
  Loader?: ComponentType<any>;
  loaderStyle?: StyleProp<ViewStyle>;
};

const DefaultLoader = memo(({ style }: { style: StyleProp<ViewStyle> }) => {
  return (
    <View
      css={`
        padding: 15px;
      `}
      style={style}
    >
      <ActivityIndicator />
    </View>
  );
});

export const SuspenseContent: FC<Props> = memo(
  ({ resourceId, errorMsg, Loader = DefaultLoader, loaderStyle, children }) => {
    const { errorBoundaryKey, retryOnError } = useRetryOnError(resourceId);

    return (
      <ErrorBoundary
        key={errorBoundaryKey}
        fallback={({ error }) => (
          <EmptyView
            error={error}
            message={__DEV__ ? error.message : errorMsg}
            onRetry={retryOnError}
            css={`
              padding: 15px;
            `}
          />
        )}
      >
        <Suspense fallback={<Loader style={loaderStyle} />}>
          {children}
        </Suspense>
      </ErrorBoundary>
    );
  },
);
