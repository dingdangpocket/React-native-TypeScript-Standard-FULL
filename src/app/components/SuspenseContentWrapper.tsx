import { TaskDetailLoader } from '@euler/app/flows/task/components/Loading';
import { useRetryOnError } from '@euler/app/flows/task/functions/useRetryOnError';
import { EmptyView } from '@euler/components/EmptyView';
import { ErrorBoundary } from '@sentry/react';
import { ComponentType, FC, memo, Suspense } from 'react';
import { ScrollView, StyleProp, ViewStyle } from 'react-native';

export const SuspenseContentWrapper: FC<{
  errorMsg?: string;
  resourceId?: string;
  Loader?: ComponentType<any>;
  ErrorBoundaryComponent?: typeof ErrorBoundary | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
}> = memo(props => {
  const { errorBoundaryKey, retryOnError } = useRetryOnError(
    props.resourceId ?? '',
  );
  const Loader = props.Loader ?? TaskDetailLoader;
  const ErrorBoundaryComponent = props.ErrorBoundaryComponent ?? ErrorBoundary;

  const contents = (
    <Suspense
      fallback={
        <ScrollView
          contentContainerStyle={[
            {
              flexGrow: 1,
              paddingTop: 15,
              justifyContent: 'flex-start',
              alignItems: 'center',
            },
            props.contentContainerStyle,
          ]}
        >
          <Loader />
        </ScrollView>
      }
    >
      {props.children}
    </Suspense>
  );

  if (props.ErrorBoundaryComponent === null) {
    return contents;
  }

  return (
    <ErrorBoundaryComponent
      key={errorBoundaryKey}
      fallback={({ error }) => (
        <ScrollView
          contentContainerStyle={[
            {
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 32,
            },
            props.contentContainerStyle,
          ]}
        >
          <EmptyView
            error={error}
            message={
              __DEV__ ? error.message : props.errorMsg ?? '对不起，出错了!'
            }
            onRetry={retryOnError}
          />
        </ScrollView>
      )}
    >
      {contents}
    </ErrorBoundaryComponent>
  );
});
