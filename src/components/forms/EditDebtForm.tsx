import React, { useState, useEffect } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import axiosInstance from '../../axios.config';
import { Debt, PaymentPlan } from '../../types';

interface EditDebtFormProps {
  debtId: string;
  onSubmit: (updatedDebt: Debt) => Promise<void>;
  onClose: () => void;
}

const EditDebtForm: React.FC<EditDebtFormProps> = ({ debtId, onSubmit, onClose }) => {
  const [updatedDebt, setUpdatedDebt] = useState<Debt | null>(null);
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/finance/debt/${debtId}`);
        const fetchedDebt: Debt = response.data.data;
        setUpdatedDebt({
          ...fetchedDebt,
          paymentPlan: fetchedDebt.paymentPlan.map((plan: PaymentPlan) => ({
            ...plan,
            paymentDate: new Date(plan.paymentDate).toISOString().split('T')[0]
          }))
        });
        setAmount(calculateAmount(fetchedDebt.debtAmount, fetchedDebt.interestRate, fetchedDebt.installment));
      } catch (error) {
        console.error('Error fetching debt details:', error);
      }
    };

    fetchData();
  }, [debtId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (updatedDebt) {
        const updatedDebtWithAmount = { ...updatedDebt, amount };
        await axiosInstance.put(`/finance/debt/${debtId}`, updatedDebtWithAmount);
        await onSubmit(updatedDebtWithAmount);
      }
    } catch (error) {
      console.error('Error updating debt:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('paymentPlan')) {
      const [_, indexStr, fieldName] = name.split('.');
      const index = parseInt(indexStr);

      setUpdatedDebt((prevState) => ({
        ...prevState!,
        paymentPlan: prevState.paymentPlan.map((plan, i) => {
          if (i === index) {
            return {
              ...plan,
              [fieldName]: value
            };
          }
          return plan;
        })
      }));
    } else {
      setUpdatedDebt((prevState) => ({
        ...prevState!,
        [name]: value
      }));

      if (name === 'debtAmount' || name === 'interestRate' || name === 'installment') {
        const newDebtAmount = name === 'debtAmount' ? parseFloat(value) : updatedDebt?.debtAmount || 0;
        const newInterestRate = name === 'interestRate' ? parseFloat(value) : updatedDebt?.interestRate || 0;
        const newInstallment = name === 'installment' ? parseFloat(value) : updatedDebt?.installment || 0;
        setAmount(calculateAmount(newDebtAmount, newInterestRate, newInstallment));
      }
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
    if (!updatedDebt) return;

    const { installment, paymentStart } = updatedDebt;
    if (installment <= 0 || !paymentStart) {
      return;
    }

    const installmentAmount = parseFloat((updatedDebt.amount / installment).toFixed(2));
    const paymentPlan: PaymentPlan[] = [];
    const startDate = new Date(paymentStart);

    for (let i = 0; i < installment; i++) {
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(paymentDate.getMonth() + i);
      paymentPlan.push({
        paymentDate: paymentDate.toISOString().split('T')[0],
        paymentAmount: installmentAmount,
        isPaid: false,
        debtId: debtId,
        userId: updatedDebt.userId
      });
    }

    setUpdatedDebt((prevState) => ({
      ...prevState!,
      paymentPlan: paymentPlan
    }));
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Debt</DialogTitle>
        <DialogContent>
          {updatedDebt && (
            <div>
              <TextField
                name="debtName"
                label="Debt Name"
                value={updatedDebt.debtName}
                onChange={handleChange}
                required
                fullWidth
                margin="dense"
              />
              <TextField
                name="lenderName"
                label="Lender Name"
                value={updatedDebt.lenderName}
                onChange={handleChange}
                required
                fullWidth
                margin="dense"
              />
              <TextField
                name="debtAmount"
                label="Debt Amount"
                type="number"
                value={updatedDebt.debtAmount}
                onChange={handleChange}
                required
                fullWidth
                margin="dense"
              />
              <TextField
                name="interestRate"
                label="Interest Rate"
                type="number"
                value={updatedDebt.interestRate}
                onChange={handleChange}
                required
                fullWidth
                margin="dense"
              />
              <TextField
                name="amount"
                label="Amount"
                type="number"
                value={amount}
                disabled
                fullWidth
                margin="dense"
              />
              <TextField
                name="installment"
                label="Installment"
                type="number"
                value={updatedDebt.installment}
                onChange={handleChange}
                required
                fullWidth
                margin="dense"
              />
              <TextField
                name="paymentStart"
                label="Payment Start"
                type="date"
                value={updatedDebt.paymentStart?.split('T')[0] || ''}
                onChange={handleChange}
                required
                fullWidth
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                name="description"
                label="Description"
                value={updatedDebt.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                margin="dense"
              />
              {updatedDebt.paymentPlan.map((plan, index) => (
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
                  />
                </div>
              ))}
              <Button
                onClick={generatePaymentPlan}
                color="primary"
              >
                Update Payment Plan
              </Button>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            color="primary"
          >
            Save
          </Button>
          <Button
            onClick={onClose}
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditDebtForm;
