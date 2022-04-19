import { ErrorFallback } from '@euler/components/error';
import { wrapNavigatorScreen } from '@euler/functions';

export const ErrorScreen = wrapNavigatorScreen(
  () => {
    return (
      <ErrorFallback
        error={new Error('The resource does not exist')}
        componentStack={null}
        eventId={null}
        resetError={() => null}
      />
    );
  },
  { headerShown: false },
);
