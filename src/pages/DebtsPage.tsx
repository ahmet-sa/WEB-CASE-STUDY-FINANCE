import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogActions } from '@material-ui/core';
import { addDebts, addDebt } from '../store/debtsSlice';
import axiosInstance from '../axios.config';
import AddDebtForm from '../components/AddDebtForm'; 

const DebtsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const debts = useSelector((state: RootState) => state.debts.debts) || [];
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDebts = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/finance/debt');
        dispatch(addDebts(response.data.data));
      } catch (error) {
        setError('Error fetching debts: ' + error.message);
        console.error('Error fetching debts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDebts();
  }, [dispatch]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmitNewDebt = (newDebt: any) => {
    dispatch(addDebt(newDebt));
    setOpen(false);
  };

  return (
    <div>
      <Button className='!ma-2' variant="contained" color="primary" onClick={handleClickOpen}>Add New Debt</Button>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Installment</TableCell>
            <TableCell>Payment Start</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {debts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>No debts found</TableCell>
            </TableRow>
          ) : (
            debts.map((debt, index) => (
              <TableRow key={index}>
                <TableCell>{debt.id}</TableCell>
                <TableCell>{debt.amount}</TableCell>
                <TableCell>{debt.installment}</TableCell>
                <TableCell>{debt.paymentStart}</TableCell>
                <TableCell>
                  <Button variant="outlined">Edit</Button>
                  <Button variant="outlined">View Payment Plan</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <AddDebtForm onSubmit={handleSubmitNewDebt} />
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DebtsPage;
