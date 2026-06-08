import { TrendingUp, Calendar, DollarSign, Target } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency, formatCompactCurrency } from '../utils/formatCurrency';
import { getTotalSpending, getThisMonthTotal, getLast30DaysTotal, getAverageDaily } from '../utils/analytics';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  border: string;
}

function StatCard({ title, value, subtitle, icon, gradient, border }: StatCardProps) {
  return (
    <div className="glass-card p-5 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 ${gradient} rounded-full blur-3xl opacity-20 -translate-y-16 translate-x-16 group-hover:opacity-30 transition-opacity`} />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl ${gradient} ${border} border flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        <p className="text-sm text-surface-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-surface-100">{value}</p>
        <p className="text-xs text-surface-600 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

export default function SummaryCards() {
  const { transactions } = useExpenses();

  const totalSpending = getTotalSpending(transactions);
  const thisMonth = getThisMonthTotal(transactions);
  const last30Days = getLast30DaysTotal(transactions);
  const avgDaily = getAverageDaily(transactions);
  const transactionCount = transactions.length;

  const cards: StatCardProps[] = [
    {
      title: 'Total Spending',
      value: formatCompactCurrency(totalSpending),
      subtitle: `${transactionCount} transactions`,
      icon: <DollarSign size={20} className="text-blue-400" />,
      gradient: 'bg-gradient-to-br from-blue-600/30 to-cyan-600/30',
      border: 'border-blue-500/20',
    },
    {
      title: 'This Month',
      value: formatCurrency(thisMonth),
      subtitle: 'Current month',
      icon: <Calendar size={20} className="text-emerald-400" />,
      gradient: 'bg-gradient-to-br from-emerald-600/30 to-teal-600/30',
      border: 'border-emerald-500/20',
    },
    {
      title: 'Last 30 Days',
      value: formatCurrency(last30Days),
      subtitle: 'Rolling period',
      icon: <TrendingUp size={20} className="text-amber-400" />,
      gradient: 'bg-gradient-to-br from-amber-600/30 to-orange-600/30',
      border: 'border-amber-500/20',
    },
    {
      title: 'Daily Average',
      value: formatCurrency(avgDaily),
      subtitle: 'Based on spending',
      icon: <Target size={20} className="text-cyan-400" />,
      gradient: 'bg-gradient-to-br from-cyan-600/30 to-blue-600/30',
      border: 'border-cyan-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
