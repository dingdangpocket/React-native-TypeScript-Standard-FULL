/**
 * @file: store.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: () => {},
});

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
