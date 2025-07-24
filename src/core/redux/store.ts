// src/core/redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

// Redux store'unu oluşturuyoruz ve authReducer'ı tanıtıyoruz.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Gelecekte başka slice'lar eklenirse buraya virgülle eklenir.
    // expenses: expensesReducer,
  },
  // Geliştirme ortamında Redux DevTools'u kullanmak için
  devTools: process.env.NODE_ENV !== 'production',
});

// Bu tipler, uygulama genelinde state ve dispatch'in doğru tiplerle
// kullanılmasını sağlar (TypeScript için en iyi pratik).
export type AppRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
