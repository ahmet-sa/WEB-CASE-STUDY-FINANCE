import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete'; // Import DeleteIcon
import { addDebts, addDebt } from '../store/debtsSlice'; // Import removeDebt action creator
import axiosInstance from '../axios.config';
import AddDebtForm from '../components/forms/AddDebtForm'; 
import EditDebtForm from '../components/forms/EditDebtForm'; 

const DebtsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<any | null>(null); 

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
    setSelectedDebt(null); // New debt case, reset selectedDebt
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmitNewDebt = (newDebt: any) => {
    dispatch(addDebt(newDebt));
    setOpen(false);
  };

  const handleEdit = (debt: any) => {
    setSelectedDebt(debt);
    setOpen(true);
  };

  const handleSubmitEdit = async (updatedDebt: any) => {
    try {
      await axiosInstance.put(`/finance/debt/${updatedDebt.id}`, updatedDebt);
      // Update debt in Redux store
      dispatch(updateDebt(updatedDebt));
    } catch (error) {
      console.error('Error updating debt:', error);
    }
    setOpen(false);
  };

  const handleDelete = async (debtId: string) => {
    try {
      await axiosInstance.delete(`/finance/debt/${debtId}`);
      // Remove the deleted debt from the Redux store
      dispatch(removeDebt(debtId));
    } catch (error) {
      console.error('Error deleting debt:', error);
    }
  };

  return (
    <div>
      <Button className='!ma-2' variant="contained" color="primary" onClick={handleClickOpen}>Add New Debt</Button>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Debt Name</TableCell>
            <TableCell>Lender Name</TableCell>
            <TableCell>Debt Amount</TableCell>
            <TableCell>Interest Rate</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Payment Start</TableCell>
            <TableCell>Installment</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {debts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8}>No debts found</TableCell>
            </TableRow>
          ) : (
            debts.map((debt, index) => (
              <TableRow key={index} onClick={() => handleEdit(debt)}>
                <TableCell>{debt.debtName}</TableCell>
                <TableCell>{debt.lenderName}</TableCell>
                <TableCell>{debt.debtAmount}</TableCell>
                <TableCell>{debt.interestRate}</TableCell>
                <TableCell>{debt.amount}</TableCell>
                <TableCell>{new Date(debt.paymentStart).toLocaleDateString()}</TableCell>
                <TableCell>{debt.installment}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEdit(debt)}>Edit</Button>
                  <Button variant="outlined">View Payment Plan</Button>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(debt.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        {selectedDebt ? (
          <EditDebtForm
            debtId={selectedDebt.id} 
            initialDebt={selectedDebt} 
            onSubmit={handleSubmitEdit}
            onClose={handleClose}
          />
        ) : (
          <AddDebtForm onSubmit={handleSubmitNewDebt} onClose={handleClose} />
        )}
      </Dialog>
    </div>
  );
}

export default DebtsPage;
