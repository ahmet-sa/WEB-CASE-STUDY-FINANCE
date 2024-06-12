import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../axios.config';

interface Payment {
  id: number;
  debtId: number;
  paymentAmount: number;
  paymentDate: string;
  isPaid: boolean;
}

interface Debt {
  id: number;
  amount: number;
  installment: number;
  paymentStart: string;
  isPaid: boolean;
}

interface DebtsState {
  debts: Debt[];
  totalDebt: number;
  remainingDebt: number;
  totalPaid: number;
  upcomingPayments: Payment[]; // New state for upcoming payments
}

const initialState: DebtsState = {
  debts: [],
  totalDebt: 0,
  remainingDebt: 0,
  totalPaid: 0,
  upcomingPayments: [], // Initialize upcoming payments
};

const debtsSlice = createSlice({
  name: 'debts',
  initialState,
  reducers: {
    addDebts(state, action: PayloadAction<Debt[]>) {
      state.debts = action.payload;
      state.totalDebt = action.payload.reduce((total, debt) => total + debt.amount, 0);
      state.remainingDebt = state.totalDebt - state.totalPaid;
    },
    addDebt(state, action: PayloadAction<Debt>) {
      const newDebt = action.payload;
      state.debts.push(newDebt);
      state.totalDebt += newDebt.amount;
      state.remainingDebt += newDebt.amount;
    },
    updateTotalPaid(state, action: PayloadAction<number>) {
      state.totalPaid += action.payload;
      state.remainingDebt -= action.payload;
    },
    updateTotalDebt(state, action: PayloadAction<number>) {
      state.totalDebt += action.payload;
      state.remainingDebt += action.payload;
    },
    setUpcomingPayments(state, action: PayloadAction<Payment[]>) {
      state.upcomingPayments = action.payload;
    },
  },
});

export const { addDebts, addDebt, updateTotalPaid, updateTotalDebt, setUpcomingPayments } = debtsSlice.actions;

export default debtsSlice.reducer;

// Fetch debts from the API
export const fetchDebts = () => async (dispatch: any) => {
  try {
    const response = await axiosInstance.get('/finance/debt');
    dispatch(addDebts(response.data.data));
  } catch (error) {
    console.error('Error fetching debts:', error);
  }
};

// Automatically update total paid and fetch upcoming payments
export const autoUpdateTotalPaid = () => async (dispatch: any, getState: any) => {
  const state = getState();
  const debts = state.debts.debts;
  let upcomingPayments: Payment[] = [];

  for (const debt of debts) {
    try {
      const response = await axiosInstance.get(`/finance/payment-plans/${debt.id}`);
      const payments: Payment[] = response.data.data;

      for (const payment of payments) {
        if (payment.isPaid) {
          dispatch(updateTotalPaid(payment.paymentAmount));
        } else {
          upcomingPayments.push(payment);
        }
      }
    } catch (error) {
      console.error(`Error updating total paid for debt ${debt.id}:`, error);
    }
  }

  // Sort and select the top 7 upcoming payments by date
  upcomingPayments.sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime());
  const topUpcomingPayments = upcomingPayments.slice(0, 7);

  dispatch(setUpcomingPayments(topUpcomingPayments));
};
