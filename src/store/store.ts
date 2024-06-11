import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authslice';
import debtsReducer from './debtsSlice';
import paymentPlansReducer from './paymentPlansSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    debts: debtsReducer,
    paymentPlans: paymentPlansReducer,
  },
});

export default store;

// Store'dan alınan durum tipini belirtir
export type RootState = ReturnType<typeof store.getState>;

// Store'a gönderilecek eylem işlevinin türünü belirtir
export type AppDispatch = typeof store.dispatch;
