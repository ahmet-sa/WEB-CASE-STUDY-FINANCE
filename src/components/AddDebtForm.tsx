import React, { useState } from 'react';
import { DialogTitle, DialogContent, DialogActions, TextField, Button } from '@material-ui/core';
import axiosInstance from '../axios.config';

const AddDebtForm: React.FC<{ onSubmit: (newDebt: any) => void }> = ({ onSubmit }) => {
  const initialDebtState = {
    debtName: '',
    lenderName: '',
    debtAmount: '',
    interestRate: '',
    amount: '',
    paymentStart: '2024-06-11',
    installment: '',
    description: '',
    paymentPlan: [{ paymentDate: '2024-06-11', paymentAmount: '' }],
  };

  const initialErrorsState = {
    debtName: '',
    lenderName: '',
    debtAmount: '',
    interestRate: '',
    amount: '',
    paymentStart: '',
    installment: '',
    description: '',
    paymentPlan: [{ paymentDate: '', paymentAmount: '' }],
  };

  const [newDebt, setNewDebt] = useState(initialDebtState);
  const [formErrors, setFormErrors] = useState(initialErrorsState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('paymentPlan')) {
      const [_, index, field] = name.split('.');
      const updatedPaymentPlan = newDebt.paymentPlan.map((plan, i) =>
        i === parseInt(index) ? { ...plan, [field]: value } : plan
      );
      const updatedPaymentPlanErrors = formErrors.paymentPlan.map((plan, i) =>
        i === parseInt(index) ? { ...plan, [field]: value ? '' : 'Required' } : plan
      );
      setNewDebt({ ...newDebt, paymentPlan: updatedPaymentPlan });
      setFormErrors({ ...formErrors, paymentPlan: updatedPaymentPlanErrors });
    } else {
      if (name === 'debtAmount' || name === 'installment') {
        const newAmount = calculateAmount(newDebt.debtAmount, newDebt.interestRate, newDebt.installment, value, name);
        setNewDebt({ ...newDebt, [name]: value, amount: newAmount });
      } else {
        setNewDebt({ ...newDebt, [name]: value });
      }
      setFormErrors({ ...formErrors, [name]: value ? '' : 'Required' });
    }
  };

  const calculateAmount = (debtAmount: number, interestRate: number, installment: number) => {
    const monthlyInterestRate = interestRate / 100; 
    const totalPayment = debtAmount * Math.pow(1 + monthlyInterestRate, installment); 
    return totalPayment.toFixed(2); 
};

const result = calculateAmount(20000, 10, 5);
console.log(result); // Output: 32210.20



  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      try {
        const response = await axiosInstance.post('/finance/debt', newDebt);
        
        onSubmit(response.data);
        
        setNewDebt(initialDebtState);
        setFormErrors(initialErrorsState);
        
      } catch (error) {
        console.error('Error adding debt:', error);
      }
    }
  };

  const isFormValid = () => {
    for (const key in newDebt) {
      if (newDebt[key] === '' || (typeof newDebt[key] === 'object' && !newDebt[key].length)) {
        return false;
      }
    }
    for (const plan of newDebt.paymentPlan) {
      if (!plan.paymentDate || !plan.paymentAmount) {
        return false;
      }
    }
    return true;
  };

  const addPaymentPlanField = () => {
    setNewDebt({
      ...newDebt,
      paymentPlan: [...newDebt.paymentPlan, { paymentDate: '', paymentAmount: '' }],
    });
    setFormErrors({
      ...formErrors,
      paymentPlan: [...formErrors.paymentPlan, { paymentDate: '', paymentAmount: '' }],
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>Add New Debt</DialogTitle>
      <DialogContent>
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
          helperText
          ={formErrors.debtAmount}
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
          label="Amount"
          type="number"
          value={newDebt.amount}
          onChange={handleChange}
          required
          fullWidth
          margin="dense"
          error={!!formErrors.amount}
          helperText={formErrors.amount}
          disabled
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
          required
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
              error={!!formErrors.paymentPlan[index].paymentDate}
              helperText={formErrors.paymentPlan[index].paymentDate}
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
              error={!!formErrors.paymentPlan[index].paymentAmount}
              helperText={formErrors.paymentPlan[index].paymentAmount}
            />
          </div>
        ))}
        <Button onClick={addPaymentPlanField} color="primary">
          Add Payment Plan
        </Button>
      </DialogContent>
      <DialogActions>
        <Button type="submit" color="primary" disabled={!isFormValid()}>Add</Button>
      </DialogActions>
    </form>
  );
};

export default AddDebtForm;

