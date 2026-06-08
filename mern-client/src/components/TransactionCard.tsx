import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, Check, X, Coffee, Car, ShoppingBag, Film, Receipt, Heart, Plane, Book, Package } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import { useExpenses, Transaction } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/formatCurrency';
import { CATEGORY_COLORS } from '../utils/analytics';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Food: <Coffee size={18} />,
  Transport: <Car size={18} />,
  Shopping: <ShoppingBag size={18} />,
  Entertainment: <Film size={18} />,
  Bills: <Receipt size={18} />,
  Health: <Heart size={18} />,
  Travel: <Plane size={18} />,
  Education: <Book size={18} />,
  Miscellaneous: <Package size={18} />,
};

interface Props {
  transaction: Transaction;
}

export default function TransactionCard({ transaction }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    amount: transaction.amount,
    description: transaction.description,
  });

  const { deleteTransaction, updateTransaction } = useExpenses();

  const handleDelete = async () => {
    if (!confirm('Delete this expense?')) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(transaction._id);
      toast.success('Expense deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async () => {
    try {
      await updateTransaction(transaction._id, {
        amount: editData.amount,
        description: editData.description,
      });
      setIsEditing(false);
      toast.success('Updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  const date = parseISO(transaction.date);
  const categoryColor = CATEGORY_COLORS[transaction.category] || '#6b7280';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`glass-card p-4 group relative ${isDeleting ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${categoryColor}20`, border: `1px solid ${categoryColor}40` }}
        >
          <span style={{ color: categoryColor }}>{CATEGORY_ICONS[transaction.category]}</span>
        </div>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="number"
                value={editData.amount}
                onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) || 0 })}
                className="glass-input text-sm py-1.5 w-28"
              />
              <input
                type="text"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="glass-input text-sm py-1.5 w-full"
              />
            </div>
          ) : (
            <>
              <p className="text-surface-100 font-medium truncate">{transaction.description || transaction.rawText}</p>
              <div className="flex items-center gap-3 mt-1">
                <span
                  className="text-xs px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: `${categoryColor}15`, color: categoryColor }}
                >
                  {transaction.category}
                </span>
                <span className="text-xs text-surface-600">
                  {format(date, 'MMM d, yyyy')}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="text-right shrink-0">
          {isEditing ? (
            <div className="flex gap-1.5">
              <button
                onClick={handleEdit}
                className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg bg-surface-700/60 text-surface-400 hover:bg-surface-700"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <p className="text-lg font-semibold text-surface-100">{formatCurrency(transaction.amount)}</p>
              <div className="flex gap-1.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded-lg text-surface-500 hover:text-surface-300 hover:bg-surface-700"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-1.5 rounded-lg text-surface-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
