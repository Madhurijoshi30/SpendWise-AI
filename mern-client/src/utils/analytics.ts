import { Transaction } from '../context/ExpenseContext';

export interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

export interface DailyTrend {
  date: string;
  total: number;
  count: number;
}

export interface MonthlyTotal {
  month: string;
  total: number;
}

export const CATEGORY_COLORS: Record<string, string> = {
  Food: '#f97316',
  Transport: '#3b82f6',
  Shopping: '#ec4899',
  Entertainment: '#8b5cf6',
  Bills: '#ef4444',
  Health: '#10b981',
  Travel: '#06b6d4',
  Education: '#f59e0b',
  Miscellaneous: '#6b7280',
};

export const getCategoryBreakdown = (transactions: Transaction[]): CategoryBreakdown[] => {
  if (transactions.length === 0) return [];

  const categoryMap = new Map<string, { total: number; count: number }>();

  transactions.forEach((t) => {
    const current = categoryMap.get(t.category) || { total: 0, count: 0 };
    categoryMap.set(t.category, {
      total: current.total + t.amount,
      count: current.count + 1,
    });
  });

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

  return Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
      percentage: (data.total / totalAmount) * 100,
    }))
    .sort((a, b) => b.total - a.total);
};

export const getDailyTrend = (transactions: Transaction[], days: number = 30): DailyTrend[] => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const dailyMap = new Map<string, { total: number; count: number }>();

  // Initialize all days
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    dailyMap.set(dateStr, { total: 0, count: 0 });
  }

  // Fill in transaction data
  transactions.forEach((t) => {
    const dateStr = new Date(t.date).toISOString().split('T')[0];
    if (dailyMap.has(dateStr)) {
      const current = dailyMap.get(dateStr)!;
      dailyMap.set(dateStr, {
        total: current.total + t.amount,
        count: current.count + 1,
      });
    }
  });

  return Array.from(dailyMap.entries())
    .map(([date, data]) => ({
      date,
      total: Math.round(data.total * 100) / 100,
      count: data.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const getMonthlyTotals = (transactions: Transaction[]): MonthlyTotal[] => {
  const monthMap = new Map<string, number>();

  transactions.forEach((t) => {
    const month = new Date(t.date).toISOString().slice(0, 7);
    monthMap.set(month, (monthMap.get(month) || 0) + t.amount);
  });

  return Array.from(monthMap.entries())
    .map(([month, total]) => ({ month, total: Math.round(total * 100) / 100 }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

export const getTotalSpending = (transactions: Transaction[]): number => {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
};

export const getAverageDaily = (transactions: Transaction[]): number => {
  if (transactions.length === 0) return 0;

  const dates = new Set(transactions.map((t) => new Date(t.date).toISOString().split('T')[0]));
  const totalDays = Math.max(dates.size, 1);
  const total = getTotalSpending(transactions);

  return Math.round((total / totalDays) * 100) / 100;
};

export const getThisMonthTotal = (transactions: Transaction[]): number => {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  return transactions
    .filter((t) => new Date(t.date).toISOString().startsWith(thisMonth))
    .reduce((sum, t) => sum + t.amount, 0);
};

export const getLast30DaysTotal = (transactions: Transaction[]): number => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return transactions
    .filter((t) => new Date(t.date) >= thirtyDaysAgo)
    .reduce((sum, t) => sum + t.amount, 0);
};
