/**
 * @file: useObservable.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { InstanceOrFactory } from '@euler/typings';
import {
  createContext,
  createElement,
  FC,
  useContext,
  useDebugValue,
  useEffect,
  useState,
} from 'react';
import { firstValueFrom, Observable, Observer, Subscription } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { useCreation } from './useCreation';

type State<T> =
  | {
      type: 'idle';
    }
  | {
      type: 'hasValue';
      value: T;
    }
  | {
      type: 'hasError';
      error: any;
    };
class ObservableSuspenseResource<T> {
  private readonly observable: Observable<T>;
  private state: State<T> = { type: 'idle' };

  constructor(observable: Observable<T>) {
    this.observable = observable.pipe(
      tap({
        next: value => {
          this.state = { type: 'hasValue', value };
        },
        error: e => {
          this.state = { type: 'hasError', error: e };
        },
      }),
      shareReplay(1),
    );
  }

  read(initialValue?: T): T {
    if (this.state.type === 'hasError') {
      throw this.state.error;
    }
    if (this.state.type === 'hasValue') {
      return this.state.value;
    }
    if (initialValue !== undefined) {
      return initialValue;
    }
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw firstValueFrom(this.observable as Observable<T>);
  }

  reveal():
    | { type: 'error'; error: any }
    | { type: 'value'; value: T }
    | { type: 'pending'; promise: Promise<T> } {
    if (this.state.type === 'hasError') {
      return { type: 'error', error: this.state.error };
    }
    if (this.state.type === 'hasValue') {
      return { type: 'value', value: this.state.value! };
    }
    return { type: 'pending', promise: firstValueFrom(this.observable) };
  }

  getState() {
    return this.state;
  }

  subscribe(observer?: Partial<Observer<T>>): Subscription {
    return this.observable.subscribe(observer);
  }
}

interface IObservableSuspenseResourceContext {
  get<T>(
    id: string,
    itemOrFactory: InstanceOrFactory<Observable<T>>,
  ): ObservableSuspenseResource<T>;
  remove(id: string): void;
  reset(): void;
  has(id: string): boolean;
}

// the default observable suspense resource context class implementation.
class ObservableSuspenseResourceScopedContextImpl
  implements IObservableSuspenseResourceContext
{
  private readonly resourceMap: Map<
    string,
    ObservableSuspenseResource<unknown>
  > = new Map();

  constructor(
    private readonly scope?: string,
    private readonly parent?: IObservableSuspenseResourceContext,
  ) {}

  has(id: string) {
    if (!this.parent || !this.scope || id.startsWith(this.scope)) {
      return this.resourceMap.has(id);
    }
    return this.parent.has(id);
  }

  get<T>(
    id: string,
    itemOrFactory: InstanceOrFactory<Observable<T>>,
  ): ObservableSuspenseResource<T> {
    if (!this.parent || !this.scope || id.startsWith(this.scope)) {
      if (this.resourceMap.has(id)) {
        return this.resourceMap.get(id) as ObservableSuspenseResource<T>;
      } else {
        const ref = new ObservableSuspenseResource(
          typeof itemOrFactory === 'function' ? itemOrFactory() : itemOrFactory,
        );
        this.resourceMap.set(id, ref);
        return ref;
      }
    } else {
      return this.parent.get<T>(id, itemOrFactory);
    }
  }

  remove(id: string) {
    if (!this.parent || !this.scope || id.startsWith(this.scope)) {
      this.resourceMap.delete(id);
    } else {
      this.parent.remove(id);
    }
  }

  reset() {
    this.resourceMap.clear();
  }
}

const ObservableSuspenseContext =
  createContext<IObservableSuspenseResourceContext>(
    new ObservableSuspenseResourceScopedContextImpl(),
  );

export const useObservableSuspenseContext =
  (): IObservableSuspenseResourceContext =>
    useContext(ObservableSuspenseContext);

/**
 * @component Scoped observable suspense resource context provider.
 */
export const ScopedObservableSuspenseResourceContextProvider: FC<{
  scope: string;
}> = ({ scope, children }) => {
  const parentResourceContext = useObservableSuspenseContext();

  const thisResourceContext = useCreation(
    () =>
      new ObservableSuspenseResourceScopedContextImpl(
        scope,
        parentResourceContext,
      ),
    [parentResourceContext, scope],
  );

  return createElement(
    ObservableSuspenseContext.Provider,
    { value: thisResourceContext },
    children,
  );
};

export function useObservable<T>(
  source: InstanceOrFactory<Observable<T>>,
  observableId: string,
  startWithValue?: T,
): T {
  const resourceHolder = useObservableSuspenseContext();
  const resource = resourceHolder.get(observableId, source);
  const [latest, setValue] = useState(resource.read(startWithValue));
  useEffect(() => {
    const subscription = resource.subscribe({
      next: v => {
        setValue(() => v);
      },
      error: e => {
        setValue(() => {
          throw e;
        });
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [observableId, resource]);
  useDebugValue(latest);
  return latest;
}
