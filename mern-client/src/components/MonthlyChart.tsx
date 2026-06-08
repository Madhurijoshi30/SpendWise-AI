import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useExpenses } from '../context/ExpenseContext';
import { getMonthlyTotals } from '../utils/analytics';
import { formatCompactCurrency, formatCurrency } from '../utils/formatCurrency';

export default function MonthlyChart() {
  const { transactions } = useExpenses();
  const monthlyData = getMonthlyTotals(transactions);

  if (monthlyData.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-surface-100 mb-4">Monthly Overview</h3>
        <div className="h-64 flex items-center justify-center text-surface-500">
          Add expenses to see monthly trends
        </div>
      </div>
    );
  }

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-800 border border-surface-700 rounded-lg px-4 py-3 shadow-xl">
          <p className="text-surface-400 text-sm">{label}</p>
          <p className="text-surface-200 font-semibold">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-surface-100 mb-4">Monthly Overview</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickFormatter={(val) => formatCompactCurrency(val)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="total"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
