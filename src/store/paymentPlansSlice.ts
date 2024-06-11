
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentPlan {
  id: number;
  debtId: number;
  paymentAmount: number;
  paymentDate: string;
  isPaid: boolean;
}

interface PaymentPlansState {
  paymentPlans: PaymentPlan[];
}

const initialState: PaymentPlansState = {
  paymentPlans: [],
};

const paymentPlansSlice = createSlice({
  name: 'paymentPlans',
  initialState,
  reducers: {
    addPaymentPlan(state, action: PayloadAction<PaymentPlan>) {
      state.paymentPlans.push(action.payload);
    },
  },
});

export const { addPaymentPlan } = paymentPlansSlice.actions;

export default paymentPlansSlice.reducer;
