import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { fetchDebts, autoUpdateTotalPaid } from '../store/debtsSlice';
import { AppDispatch } from '../store/store';

const COLORS = ['#4CAF50', '#FF9800'];

const PieChartComponent = ({ data }: { data: any[] }) => (
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
        {data.map((_entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const debts = useSelector((state: RootState) => state.debts.debts);
  const totalPaid = useSelector((state: RootState) => state.debts.totalPaid);
  const totalDebt = useSelector((state: RootState) => state.debts.totalDebt);
  const remainingDebt = useSelector((state: RootState) => state.debts.remainingDebt);
  const upcomingPayments = useSelector((state: RootState) => state.debts.upcomingPayments);
  const [loading, setLoading] = useState(false);
  const tableCellClass = '!text-primary !text-roboto text-16px';

  useEffect(() => {
    setLoading(true);
    dispatch(fetchDebts())
      .then(() => dispatch(autoUpdateTotalPaid()))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [dispatch]);

  const totalUnpaid = debts.reduce((total, debt) => total + (debt.amount || 0), 0) - (totalPaid || 0);

  const pieChartData = [
    { name: 'Unpaid Debts', value: totalUnpaid > 0 ? totalUnpaid : 0 },
    { name: 'Paid Debts', value: totalPaid > 0 ? totalPaid : 0 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start', margin: '20px' }}>
      <div style={{ flex: 1, maxWidth: '50%', paddingRight: '20px' }}>
        <h2 className='text-primary text-center'>Debts Overview</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {debts.length > 0 && <PieChartComponent data={pieChartData} />}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <h4 className='text-primary'>Total Debt: ${totalDebt ? totalDebt.toFixed(2) : '0.00'}</h4>
              <h4 className='text-primary'>Paid Debt: ${totalPaid ? totalPaid.toFixed(2) : '0.00'}</h4>
              <h4 className='text-primary'>Remaining Debt: ${remainingDebt ? remainingDebt.toFixed(2) : '0.00'}</h4>
            </div>
          </>
        )}
      </div>
      <div className='w-full' style={{ flex: 1, paddingLeft: '20px' }}>
        <h2 className='text-secondary text-center'>Upcoming Payments</h2>
        {upcomingPayments.length === 0 ? (
          <div className='text-secondary'>No upcoming payments.</div>
        ) : (
          <table className="table w-full text-center">
            <thead>
              <tr>
                <th className={tableCellClass}>Debt</th>
                <th className={tableCellClass}>Amount</th>
                <th className={tableCellClass}>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {upcomingPayments.map((payment) => {
                const debt = debts.find((d) => d.id === payment.debtId);
                return (
                  <tr className='tableRow' key={payment.id}>
                    <td className='text-gray-5 font-semibold'>{debt?.debtName || `Debt ID: ${payment.debtId}`}</td>
                    <td className='text-gray-5'>${payment.paymentAmount.toFixed(2)}</td>
                    <td className='text-gray-5'>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
