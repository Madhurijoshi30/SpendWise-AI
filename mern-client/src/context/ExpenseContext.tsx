import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { expenseAPI } from '../services/api';
import { useAuth } from './AuthContext';

export interface Transaction {
  _id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  rawText: string;
  createdAt: string;
}

interface ExpenseContextType {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  filters: {
    category: string;
    search: string;
  };
  setFilters: (filters: { category?: string; search?: string }) => void;
  fetchTransactions: () => Promise<void>;
  addTransaction: (text: string) => Promise<Transaction>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | null>(null);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState({ category: 'all', search: '' });

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await expenseAPI.getExpenses({
        category: filters.category !== 'all' ? filters.category : undefined,
        search: filters.search || undefined,
      });
      setTransactions(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [user, filters.category, filters.search]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const setFilters = (newFilters: { category?: string; search?: string }) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  const addTransaction = async (text: string): Promise<Transaction> => {
    const res = await expenseAPI.parseExpense(text);
    const newTransaction = res.data;
    setTransactions((prev) => [newTransaction, ...prev]);
    return newTransaction;
  };

  const updateTransaction = async (id: string, data: Partial<Transaction>) => {
    await expenseAPI.updateExpense(id, data);
    setTransactions((prev) =>
      prev.map((t) => (t._id === id ? { ...t, ...data } : t))
    );
  };

  const deleteTransaction = async (id: string) => {
    await expenseAPI.deleteExpense(id);
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        loading,
        error,
        filters,
        setFilters,
        fetchTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within ExpenseProvider');
  }
  return context;
};
