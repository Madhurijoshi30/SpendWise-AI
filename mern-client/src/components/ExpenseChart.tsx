import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useExpenses } from '../context/ExpenseContext';
import { getCategoryBreakdown, CATEGORY_COLORS } from '../utils/analytics';
import { formatCompactCurrency } from '../utils/formatCurrency';

const COLORS = ['#f97316', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444', '#10b981', '#06b6d4', '#f59e0b', '#6b7280'];

export default function ExpenseChart() {
  const { transactions } = useExpenses();
  const breakdown = getCategoryBreakdown(transactions);

  if (breakdown.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-surface-100 mb-4">Spending by Category</h3>
        <div className="h-64 flex items-center justify-center text-surface-500">
          Add expenses to see your breakdown
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface-800 border border-surface-700 rounded-lg px-4 py-3 shadow-xl">
          <p className="text-surface-200 font-medium">{data.category}</p>
          <p className="text-surface-400 text-sm">{formatCompactCurrency(data.total)}</p>
          <p className="text-surface-600 text-xs">{data.percentage.toFixed(1)}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-surface-100 mb-4">Spending by Category</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={breakdown}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="total"
            >
              {breakdown.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CATEGORY_COLORS[entry.category] || COLORS[index % COLORS.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
        {breakdown.slice(0, 6).map((item) => (
          <div key={item.category} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[item.category] || '#6b7280' }}
            />
            <span className="text-xs text-surface-400 truncate">{item.category}</span>
            <span className="text-xs text-surface-600 ml-auto">{item.percentage.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
