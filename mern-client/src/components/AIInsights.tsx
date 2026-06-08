import { Lightbulb, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { getCategoryBreakdown } from '../utils/analytics';
import { formatCompactCurrency } from '../utils/formatCurrency';

export default function AIInsights() {
  const { transactions } = useExpenses();
  const breakdown = getCategoryBreakdown(transactions);

  if (transactions.length === 0) return null;

  const topCategory = breakdown[0];
  const totalSpending = transactions.reduce((sum, t) => sum + t.amount, 0);
  const avgTransaction = totalSpending / transactions.length;

  const insights = [];

  // Spending pattern insight
  if (topCategory && topCategory.percentage > 40) {
    insights.push({
      type: 'warning',
      icon: <AlertCircle size={16} />,
      title: 'High Category Concentration',
      text: `${topCategory.category} accounts for ${topCategory.percentage.toFixed(0)}% of your spending. Consider diversifying your budget.`,
    });
  }

  // Positive insight
  if (avgTransaction < 50) {
    insights.push({
      type: 'success',
      icon: <CheckCircle size={16} />,
      title: 'Conservative Spending',
      text: `Your average transaction is ${formatCompactCurrency(avgTransaction)}. You're making mindful purchases.`,
    });
  }

  // Trend insight
  if (transactions.length >= 5) {
    insights.push({
      type: 'info',
      icon: <TrendingUp size={16} />,
      title: 'Top Spending Category',
      text: `You spend most on ${topCategory?.category || 'various categories'} - total: ${formatCompactCurrency(topCategory?.total || 0)}.`,
    });
  }

  if (insights.length === 0) return null;

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-amber-500/30 bg-amber-500/5';
      case 'success':
        return 'border-emerald-500/30 bg-emerald-500/5';
      default:
        return 'border-blue-500/30 bg-blue-500/5';
    }
  };

  const getIconStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-amber-400';
      case 'success':
        return 'text-emerald-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/30 to-orange-500/30 border border-amber-500/20 flex items-center justify-center">
          <Lightbulb size={16} className="text-amber-400" />
        </div>
        <h3 className="text-lg font-semibold text-surface-100">AI Insights</h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border ${getTypeStyles(insight.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className={getIconStyles(insight.type)}>{insight.icon}</div>
              <div>
                <p className="text-sm font-medium text-surface-200">{insight.title}</p>
                <p className="text-xs text-surface-500 mt-0.5">{insight.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
