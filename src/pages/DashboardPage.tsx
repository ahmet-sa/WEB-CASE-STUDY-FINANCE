import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const COLORS = ['#0088FE', '#00C49F'];

const PiaChart = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
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
  const debts = useSelector((state: RootState) => state.debts.debts);

  const totalUnpaid = debts.reduce((total, debt) => total + debt.amount, 0);
  const totalPaid = 20; 

  const pieChartData = [
    { name: 'Unpaid Debts', value: totalUnpaid },
    { name: 'Paid Debts', value: totalPaid },
  ];

  return (
    <div>
      <div>
        <h2>Debts Overview</h2>
        <PiaChart data={pieChartData} />
      </div>
    </div>
  );
};

export default DashboardPage;
