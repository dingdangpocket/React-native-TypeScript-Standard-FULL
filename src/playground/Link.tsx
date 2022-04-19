import { ReactNode, useCallback } from 'react';

export const Link = ({
  page,
  children,
}: {
  page: string;
  children: ReactNode;
}) => {
  const onClick = useCallback(() => {
    console.log(`click link ${page}`);
  }, [page]);

  return (
    <a href={page} className="normal" onClick={onClick}>
      {children}
    </a>
  );
};
