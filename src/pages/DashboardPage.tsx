import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { fetchDebts, autoUpdateTotalPaid } from '../store/debtsSlice';
import { AppDispatch } from '../store/store'; 
import { Debt, PaymentPlan } from '../../types';

const COLORS = ['#0088FE', '#00C49F'];

const PieChartComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch type for dispatch
  const debts = useSelector((state: RootState) => state.debts.debts);
  const totalPaid = useSelector((state: RootState) => state.debts.totalPaid);
  const totalDebt = useSelector((state: RootState) => state.debts.totalDebt);
  const remainingDebt = useSelector((state: RootState) => state.debts.remainingDebt);
  const upcomingPayments = useSelector((state: RootState) => state.debts.upcomingPayments);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchDebts())
      .then(() => dispatch(autoUpdateTotalPaid())) 
      .then(() => setLoading(false))
      .catch((error: any) => {
        console.error('Error fetching debts:', error);
        setLoading(false);
      });
  }, [dispatch]);

  const totalUnpaid = debts.reduce((total, debt) => total + debt.amount, 0) - totalPaid;

  const pieChartData = [
    { name: 'Unpaid Debts', value: totalUnpaid },
    { name: 'Paid Debts', value: totalPaid },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start', margin: '20px' }}>
      <div style={{ flex: 1, maxWidth: '50%', paddingRight: '20px' }}>
        <h2>Debts Overview</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <PieChartComponent data={pieChartData} />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <h3>Total Debt: ${totalDebt.toFixed(2)}</h3>
              <h3>Paid Debt: ${totalPaid.toFixed(2)}</h3>
              <h3>Remaining Debt: ${remainingDebt.toFixed(2)}</h3>
            </div>
          </>
        )}
      </div>
      <div style={{ flex: 1, maxWidth: '50%', paddingLeft: '20px' }}>
        <h3>Upcoming Payments</h3>
        {upcomingPayments.length === 0 ? (
          <div>No upcoming payments.</div>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {upcomingPayments.map((payment) => {
              const debt = debts.find((d) => d.id === payment.debtId);
              console.log(debt)
              return (
                <li key={payment.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                  {debt?.debtName || `Debt ID: ${payment.debtId}`} - Amount: ${payment.paymentAmount.toFixed(2)} - Due Date: {new Date(payment.paymentDate).toLocaleDateString()}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
