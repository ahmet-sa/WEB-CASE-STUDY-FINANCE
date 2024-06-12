

import { Debt, FormErrors } from './types';

export const initialDebtState: Debt = {
    debtName: '',
    lenderName: '',
    debtAmount: 0,
    interestRate: 0,
    amount: 0,
    paymentStart: '',
    installment: 0,
    description: '',
    paymentPlan: [],
    id: '',
    createdAt: '',
    updatedAt: '',
    isActive: false,
    userId: ''
};

export const initialErrorsState: FormErrors = {
  debtName: '',
  lenderName: '',
  debtAmount: '',
  interestRate: '',
  amount: '',
  paymentStart: '',
  installment: '',
  description: '',
  paymentPlan: [], 
};
