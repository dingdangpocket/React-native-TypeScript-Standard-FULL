/**
 * @file: factory.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { config } from '@euler/config';
import { HttpClient } from '@euler/lib/request';
import {
  CacheService,
  StorageService,
  TokenService,
} from '@euler/lib/services';
import { AsyncStorageProvider } from '@euler/lib/storage/impl/AsyncStorageProvider';
import { SecureStorageProvider } from '@euler/lib/storage/impl/SecureStorageProvider';
import {
  AuthService,
  InventoryService,
  MediaFileService,
  OcrService,
  OrderService,
  SmsService,
  StoreService,
  TaskService,
  UserService,
  VehicleInfoService,
} from '@euler/services';
import {
  AuthenticationInvalidationMiddleware,
  AuthTokenMiddleware,
  ClientInfoMiddleware,
} from '@euler/services/middlewares';
import React, { ReactNode, useContext } from 'react';
import { Platform } from 'react-native';

export const defaultStorageService = new StorageService(
  AsyncStorageProvider.shared,
);
export const defaultSecureStorageService = new StorageService(
  SecureStorageProvider.shared,
);
export const cacheService = new CacheService(defaultStorageService);

export const defaultTokenService = new TokenService(
  Platform.select({
    web: defaultStorageService,
    native: defaultSecureStorageService,
  })!,
);

export const api = new HttpClient(cacheService, {
  endPoint: config.apiEndpoint,
  timeout: config.requestTimeout,
  prefix: { url: '/api' },
  middlewares: [
    new AuthTokenMiddleware(),
    new ClientInfoMiddleware(),
    new AuthenticationInvalidationMiddleware(),
  ],
});

export const serviceFactory = {
  defaultStorageService,
  defaultSecureStorageService,
  defaultTokenService,
  cacheService,
  authService: new AuthService(api),
  userService: new UserService(api),
  smsService: new SmsService(api),
  taskService: new TaskService(api),
  storeService: new StoreService(api),
  ocrService: new OcrService(api),
  orderService: new OrderService(api),
  vehicleInfoService: new VehicleInfoService(api),
  inventoryService: new InventoryService(api),
  mediaFileService: new MediaFileService(api),
};

export type ServiceFactory = typeof serviceFactory;

const ServiceFactoryContext = React.createContext<typeof serviceFactory>(
  null as any,
);

export const useServiceFactory = () => useContext(ServiceFactoryContext);

export const ServiceFactoryProvider = (props: {
  serviceFactory?: typeof serviceFactory;
  children: ReactNode;
}) => {
  return (
    <ServiceFactoryContext.Provider
      value={props.serviceFactory ?? serviceFactory}
    >
      {props.children}
    </ServiceFactoryContext.Provider>
  );
};
