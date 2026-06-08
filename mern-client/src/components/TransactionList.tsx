import { AnimatePresence } from 'framer-motion';
import { Loader2, Receipt } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import TransactionCard from './TransactionCard';

export default function TransactionList() {
  const { transactions, loading, error } = useExpenses();

  if (loading) {
    return (
      <div className="glass-card p-12 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-brand-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-800/80 flex items-center justify-center mb-4">
          <Receipt size={32} className="text-surface-600" />
        </div>
        <p className="text-surface-400 font-medium mb-1">No expenses yet</p>
        <p className="text-surface-600 text-sm">Add your first expense using the AI parser above</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {transactions.map((transaction) => (
          <TransactionCard key={transaction._id} transaction={transaction} />
        ))}
      </AnimatePresence>
    </div>
  );
}
