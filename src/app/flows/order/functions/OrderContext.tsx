/**
 * @file: OrderContext.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useCreation } from '@euler/utils/hooks';
import React, { FC, memo, useContext, useMemo } from 'react';
import { Subject } from 'rxjs';

export type OrderContextType = {
  orderCreationSuccessful: Subject<string>;
};

export const OrderContext = React.createContext<OrderContextType>(null as any);

export const useOrderContext = () => useContext(OrderContext);

export const OrderContextProvider: FC = memo(props => {
  const orderCreationSuccessful = useCreation(() => new Subject<string>(), []);
  const value = useMemo(
    () => ({ orderCreationSuccessful }),
    [orderCreationSuccessful],
  );
  return (
    <OrderContext.Provider value={value}>
      {props.children}
    </OrderContext.Provider>
  );
});
