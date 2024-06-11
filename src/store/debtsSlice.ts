// store/debtsSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Debt {
  id: number;
  amount: number;
  installment: number;
  paymentStart: string;
}

interface DebtsState {
  debts: Debt[];
}

const initialState: DebtsState = {
  debts: [],
};

const debtsSlice = createSlice({
  name: 'debts',
  initialState,
  reducers: {
    addDebts(state, action: PayloadAction<Debt[]>) {
      state.debts = action.payload;
    },
    addDebt(state, action: PayloadAction<Debt>) {
      state.debts.push(action.payload);
    },
  },
});

export const { addDebts, addDebt } = debtsSlice.actions;

export default debtsSlice.reducer;
