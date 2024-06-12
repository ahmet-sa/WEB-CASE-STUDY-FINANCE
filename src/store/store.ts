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

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
