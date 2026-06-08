import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useExpenses } from '../context/ExpenseContext';
import { getDailyTrend } from '../utils/analytics';
import { formatCompactCurrency, formatCurrency } from '../utils/formatCurrency';

export default function ExpenseTrend() {
  const { transactions } = useExpenses();
  const trendData = getDailyTrend(transactions, 30);

  if (trendData.length === 0 || trendData.every(d => d.total === 0)) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-surface-100 mb-4">30-Day Spending Trend</h3>
        <div className="h-48 flex items-center justify-center text-surface-500">
          Add expenses to see your spending trend
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-800 border border-surface-700 rounded-lg px-4 py-3 shadow-xl">
          <p className="text-surface-400 text-sm">{label}</p>
          <p className="text-surface-200 font-semibold">{formatCurrency(payload[0].value)}</p>
          <p className="text-surface-600 text-xs">{payload[0].payload.count} transactions</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-surface-100 mb-4">30-Day Spending Trend</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              tickFormatter={(val) => formatCompactCurrency(val)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
