import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { addDebts, updateTotalPaid } from '../store/debtsSlice'; 
import axiosInstance from '../axios.config';
import AddDebtForm from '../components/forms/AddDebtForm'; 
import EditDebtForm from '../components/forms/EditDebtForm'; 
import DeleteConfirmationForm from '../components/forms/DeleteConfirmationForm';
import { useNavigate } from 'react-router-dom';

const DebtsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<any | null>(null);
  const [debtToDeleteId, setDebtToDeleteId] = useState<string | null>(null);

  const debts = useSelector((state: RootState) => state.debts.debts) || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/finance/debt');
      dispatch(addDebts(response.data.data));
      dispatch(updateTotalPaid(response.data.totalPaid));
    } catch (error) {
      setError('Error fetching debts: ' + (error as Error).message);
      console.error('Error fetching debts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setSelectedDebt(null);
    setOpenAddEditDialog(true);
  };

  const handleCloseAddEditDialog = () => {
    setOpenAddEditDialog(false);
    fetchDebts(); 
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDebtToDeleteId(null);
  };

  const handleSubmitNewDebt = async (newDebt: any) => {
    try {
      const response = await axiosInstance.post('/finance/debt', {
        debtName: newDebt.debtName, 
        ...newDebt 
      });
      if (response.status === 200) {
        setOpenAddEditDialog(false);
        fetchDebts(); 
      } else {
        setError('Error adding new debt: Unexpected response from server');
      }
    } catch (error) {
      setError('Error adding new debt: ' + (error as Error).message);
      console.error('Error adding new debt:', error);
    }
  };

  const handleEdit = (debt: any) => {
    setSelectedDebt(debt);
    setOpenAddEditDialog(true);
  };

  const handleSubmitEdit = async (updatedDebt: any) => {
    try {
      await axiosInstance.put(`/finance/debt/${updatedDebt.id}`, updatedDebt);
      setOpenAddEditDialog(false);
      fetchDebts(); 
    } catch (error) {
      setError('Error updating debt: ' + (error as Error).message);
      console.error('Error updating debt:', error);
    }
  };

  const handleDelete = (debtId: string) => {
    setDebtToDeleteId(debtId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/finance/debt/${debtToDeleteId}`);
      setOpenDeleteDialog(false);
      fetchDebts(); 
    } catch (error) {
      setError('Error deleting debt: ' + (error as Error).message);
      console.error('Error deleting debt:', error);
    }
  };

  const handleViewPaymentPlan = (debtId: string) => {
    navigate(`/payment-plan?debtId=${debtId}`);
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
              <TableRow key={index}>
                <TableCell>{debt.debtName}</TableCell>
                <TableCell>{debt.lenderName}</TableCell>
                <TableCell>{debt.debtAmount}</TableCell>
                <TableCell>{debt.interestRate}</TableCell>
                <TableCell>{debt.amount}</TableCell>
                <TableCell>{new Date(debt.paymentStart).toLocaleDateString()}</TableCell>
                <TableCell>{debt.installment}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEdit(debt)}>Edit</Button>
                  <Button variant="outlined" onClick={() => handleViewPaymentPlan(debt.id.toString())}>View Payment Plan</Button>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(debt.id.toString())}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={openAddEditDialog} onClose={handleCloseAddEditDialog}>
        {selectedDebt ? (
          <EditDebtForm
            debtId={selectedDebt.id.toString()} 
            initialDebt={selectedDebt} 
            onSubmit={handleSubmitEdit}
            onClose={handleCloseAddEditDialog}
          />
        ) : (
          <AddDebtForm onSubmit={handleSubmitNewDebt} />
        )}
      </Dialog>

      <DeleteConfirmationForm 
        open={openDeleteDialog}  
        onClose={handleCloseDeleteDialog} 
        onConfirm={handleConfirmDelete} 
      />
    </div>
  );
};

export default DebtsPage;
