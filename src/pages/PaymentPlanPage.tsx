import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Table, TableHead, TableRow, TableCell, TableBody, FormControl, Select, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import axiosInstance from '../axios.config';
import { useNavigate } from 'react-router-dom';

const PaymentPlanPage: React.FC = () => {
  const [paymentPlan, setPaymentPlan] = useState<any[]>([]);
  const [selectedDebt, setSelectedDebt] = useState<string | null>(null);
  const [debts, setDebts] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [, setTotalPaid] = useState<number>(0); 
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchDebts();
    }
  }, [isAuthenticated, navigate]);

  const fetchDebts = async () => {
    try {
      const response = await axiosInstance.get('/finance/debt');
      setDebts(response.data.data);
    } catch (error) {
      console.error('Error fetching debts:', error);
    }
  };

  useEffect(() => {

    if (selectedDebt) {
      fetchPaymentPlan(selectedDebt);
    }
  }, [selectedDebt]);

  const fetchPaymentPlan = async (debtId: string) => {
    try {
      const response = await axiosInstance.get(`/finance/payment-plans/${debtId}`);
      setPaymentPlan(response.data.data);
    } catch (error) {
      console.error('Error fetching payment plan:', error);
    }
  };

  const handleDebtChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedDebt(event.target.value as string);
  };

  const handlePaymentStatusChange = async (paymentPlanId: string) => {
    try {
      const paymentToUpdate = paymentPlan.find(payment => payment.id === paymentPlanId);
      if (paymentToUpdate) {
        const updatedPayment = { ...paymentToUpdate, isPaid: !paymentToUpdate.isPaid }; 
        await axiosInstance.put(`/finance/payment-plans/${paymentPlanId}`, updatedPayment);
        fetchPaymentPlan(selectedDebt || '');
        updateTotalPaid(updatedPayment.isPaid);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const updateTotalPaid = (isPaid: boolean) => {
    setTotalPaid(prevTotal => isPaid ? prevTotal + 1 : prevTotal - 1);
  };

  const handleEditPayment = (payment: any) => {
    setSelectedPayment(payment);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handlePaymentUpdate = async () => {
    if (selectedPayment) {
      try {
        await axiosInstance.put(`/finance/payment-plans/${selectedPayment.id}`, selectedPayment);
        setIsDialogOpen(false);
        fetchPaymentPlan(selectedDebt || '');
        updateTotalPaid(selectedPayment.isPaid);
      } catch (error) {
        console.error('Error updating payment:', error);
      }
    }
  };

  return (
    <div>
      <FormControl fullWidth>
        <Select
          value={selectedDebt || ''}
          onChange={handleDebtChange}
          displayEmpty
          fullWidth
        >
          <MenuItem value="" disabled>
            Select Debt
          </MenuItem>
          {debts.map((debt) => (
            <MenuItem key={debt.id} value={debt.id}>
              {debt.debtName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedDebt && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Payment Date</TableCell>
              <TableCell>Payment Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentPlan.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                <TableCell>{payment.paymentAmount}</TableCell>
                <TableCell>{payment.isPaid ? 'Paid' : 'Not Paid'}</TableCell>
                <TableCell>
                  {!payment.isPaid ? (
                    <>
                      <Button onClick={() => handlePaymentStatusChange(payment.id)}>Mark as Paid</Button>
                      <Button onClick={() => handleEditPayment(payment)}>Edit</Button>
                    </>
                  ) : (
                    <Button onClick={() => handlePaymentStatusChange(payment.id)}>Mark as Not Paid</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit Payment</DialogTitle>
        <DialogContent>
          <TextField
            label="Payment Date"
            type="date"
            value={selectedPayment?.paymentDate || ''}
            onChange={(e) => setSelectedPayment({...selectedPayment, paymentDate: e.target.value})}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Payment Amount"
            type="number"
            value={selectedPayment?.paymentAmount || ''}
            onChange={(e) => setSelectedPayment({...selectedPayment, paymentAmount: e.target.value})}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePaymentUpdate} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PaymentPlanPage;
