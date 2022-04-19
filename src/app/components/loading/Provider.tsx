import { useBehaviorSubject } from '@euler/utils/hooks';
import React, {
  memo,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { Fill } from 'react-slot-fill';
import { BehaviorSubject } from 'rxjs';
import { Loading } from './Loading';
import { LoadingProps } from './types';

export type LoadingContextProps = {
  subject: BehaviorSubject<LoadingProps | null>;
};

export const LoadingContext = React.createContext<LoadingContextProps>(
  null as any,
);

export const LoadingProvider = memo(({ children }: { children: ReactNode }) => {
  const subject = useMemo(
    () => new BehaviorSubject<LoadingProps | null>(null),
    [],
  );
  const contextValue = useMemo(() => ({ subject }), [subject]);
  const [props] = useBehaviorSubject(subject);
  const visible = Boolean(props);
  useEffect(() => {
    if (visible && props?.duration) {
      const timer = setTimeout(() => {
        subject.next(null);
      });
      return () => clearTimeout(timer);
    }
  }, [props?.duration, subject, visible]);
  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      <Fill name="portal">
        {visible && <Loading {...props} visible={visible} />}
      </Fill>
    </LoadingContext.Provider>
  );
});

export const useAppLoading = () => {
  const { subject } = useContext(LoadingContext);

  const show = useCallback(
    (props?: string | LoadingProps) => {
      if (typeof props === 'string') {
        props = { type: 'loading', message: props };
      } else if (!props) {
        props = { type: 'loading' };
      }
      subject.next(props);
    },
    [subject],
  );

  const hide = useCallback(() => {
    subject.next(null);
  }, [subject]);

  const controller = useMemo(() => ({ show, hide }), [show, hide]);

  return controller;
};
