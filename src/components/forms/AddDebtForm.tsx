import React, { useState } from 'react';
import { DialogTitle, DialogContent, DialogActions, TextField, Button } from '@material-ui/core';
import { Debt, FormErrors, PaymentPlan } from '../../types';
import { initialDebtState, initialErrorsState } from '../../constants';

const AddDebtForm: React.FC<{ onSubmit: (newDebt: any) => void }> = ({ onSubmit }) => {
  const [newDebt, setNewDebt] = useState<Debt>(initialDebtState);
  const [formErrors, setFormErrors] = useState<FormErrors>(initialErrorsState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value);

    if (name.startsWith('paymentPlan')) {
      const [_, index, field] = name.split('.');
      const updatedPaymentPlan = newDebt.paymentPlan.map((plan, i) =>
        i === parseInt(index) ? { ...plan, [field]: value } : plan
      );
      const updatedPaymentPlanErrors = formErrors.paymentPlan.map((plan, i) =>
        i === parseInt(index) ? { ...plan, [field]: value ? '' : 'Gerekli' } : plan
      );
      setNewDebt({ ...newDebt, paymentPlan: updatedPaymentPlan });
      setFormErrors({ ...formErrors, paymentPlan: updatedPaymentPlanErrors });
    } else {
      let updatedDebt = { ...newDebt, [name]: name === 'debtAmount' || name === 'installment' || name === 'interestRate' ? parsedValue : value };
      
      if (name === 'debtAmount' || name === 'installment' || name === 'interestRate') {
        updatedDebt.amount = calculateAmount(
          updatedDebt.debtAmount,
          updatedDebt.interestRate,
          updatedDebt.installment
        );
      }
      setNewDebt(updatedDebt);
      setFormErrors({ ...formErrors, [name]: value ? '' : 'Gerekli' });
    }
  };

  const calculateAmount = (debtAmount: number, interestRate: number, installment: number) => {
    if (debtAmount <= 0 || interestRate <= 0 || installment <= 0) {
      return 0;
    }
    const monthlyInterestRate = interestRate / 100;
    const totalPayment = debtAmount * Math.pow(1 + monthlyInterestRate, installment);
    return parseFloat(totalPayment.toFixed(2));
  };

  const generatePaymentPlan = () => {
    const { amount, installment, paymentStart } = newDebt;
    if (installment <= 0 || amount <= 0) {
      return [];
    }
    const installmentAmount = parseFloat((amount / installment).toFixed(2));
    const paymentPlan: PaymentPlan[] = [];
    const startDate = new Date(paymentStart);

    for (let i = 0; i < installment; i++) {
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(paymentDate.getMonth() + i);
      paymentPlan.push({
        paymentDate: paymentDate.toISOString().split('T')[0],
        paymentAmount: installmentAmount,
      });
    }
    setNewDebt({ ...newDebt, paymentPlan });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit(newDebt);
      setNewDebt(initialDebtState);
      setFormErrors(initialErrorsState);
    }
  };

  const isFormValid = () => {
    for (const key in newDebt) {
      const value = newDebt[key as keyof Debt];
      if (   key !== 'userId' &&  key !== 'updatedAt' &&  key !== 'updatedAt' && key !== 'lenderName' && key !== 'id' &&  key !== 'description' &&  key !== 'createdAt' &&  key !== 'updatedAt') {
        if (
          (typeof value === 'string' && value.trim() === '') ||
          (typeof value === 'number' && value <= 0) ||
          (Array.isArray(value) && value.length === 0)
        ) {
          console.log(key)
          return false;
        }
      }
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-4  w-100 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4 text-primary text-center">Add New Debt</h1>
        <div className="flex flex-col space-y-4">
          <TextField
            name="debtName"
            label="Debt Name"
            value={newDebt.debtName}
            onChange={handleChange}
            required
            fullWidth
            margin="dense"
            error={!!formErrors.debtName}
            helperText={formErrors.debtName}
          />
          <TextField
            name="lenderName"
            label="Lender Name"
            value={newDebt.lenderName}
            onChange={handleChange}
            required
            fullWidth
            margin="dense"
            error={!!formErrors.lenderName}
            helperText={formErrors.lenderName}
          />
          <TextField
            name="debtAmount"
            label="Debt Amount"
            type="number"
            value={newDebt.debtAmount}
            onChange={handleChange}
            required
            fullWidth
            margin="dense"
            error={!!formErrors.debtAmount}
            helperText={formErrors.debtAmount}
          />
          <TextField
            name="interestRate"
            label="Interest Rate"
            type="number"
            value={newDebt.interestRate}
            onChange={handleChange}
            required
            fullWidth
            margin="dense"
            error={!!formErrors.interestRate}
            helperText={formErrors.interestRate}
          />
          <TextField
            name="installment"
            label="Installment"
            type="number"
            value={newDebt.installment}
            onChange={handleChange}
            required
            fullWidth
            margin="dense"
            error={!!formErrors.installment}
            helperText={formErrors.installment}
          />
          <TextField
            name="amount"
            label="Total Amount"
            type="number"
            value={newDebt.amount}
            disabled
            fullWidth
            margin="dense"
            error={!!formErrors.amount}
            helperText={formErrors.amount}
          />
          <TextField
            name="paymentStart"
            label="Payment Start"
            type="date"
            value={newDebt.paymentStart}
            onChange={handleChange}
            required
            fullWidth
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
            error={!!formErrors.paymentStart}
            helperText={formErrors.paymentStart}
          />
          <TextField
            name="description"
            label="Description"
            value={newDebt.description}
            onChange={handleChange}
            fullWidth
            margin="dense"
            error={!!formErrors.description}
            helperText={formErrors.description}
          />

          {newDebt.paymentPlan.map((plan, index) => (
            <div key={index}>
              <TextField
                name={`paymentPlan.${index}.paymentDate`}
                label="Payment Date"
                type="date"
                value={plan.paymentDate}
                onChange={handleChange}
                required
                fullWidth
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!formErrors.paymentPlan[index]?.paymentDate}
                helperText={formErrors.paymentPlan[index]?.paymentDate}
              />
              <TextField
                name={`paymentPlan.${index}.paymentAmount`}
                label="Payment Amount"
                type="number"
                value={plan.paymentAmount}
                onChange={handleChange}
                required
                fullWidth
                margin="dense"
                error={!!formErrors.paymentPlan[index]?.paymentAmount}
                helperText={formErrors.paymentPlan[index]?.paymentAmount}
              />
            </div>
          ))}
          <Button className='!bg-primary !text-white !w-40 !rounded-10px !normal-case !mt-20px' onClick={generatePaymentPlan} color="primary">
            Create Payment Plan
          </Button>
        </div>
      </div>
      <DialogActions className='bg-white' >
        <Button className='!bg-primary !rounded-10px !text-white' type="submit" color="primary" disabled={!isFormValid()}>
          Add
        </Button>
      </DialogActions>
    </form>
  );
};

export default AddDebtForm;