import { Context, ReactNode, useContext, useMemo, useRef } from 'react';

export function useContextBridge(...contexts: Array<Context<any>>) {
  const cRef = useRef<Array<Context<any>>>([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  cRef.current = contexts.map(context => useContext(context));
  return useMemo(
    () =>
      ({ children }: { children: ReactNode }): JSX.Element =>
        contexts.reduceRight(
          (acc, Ctx, i) => (
            <Ctx.Provider value={cRef.current[i]}>{acc}</Ctx.Provider>
          ),
          children,
        ) as unknown as JSX.Element,
    // eslint-disable-next-line
    [],
  );
}
