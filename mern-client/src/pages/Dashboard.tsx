import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ExpenseProvider } from '../context/ExpenseContext';
import QuickAdd from '../components/QuickAdd';
import SummaryCards from '../components/SummaryCards';
import ExpenseChart from '../components/ExpenseChart';
import MonthlyChart from '../components/MonthlyChart';
import ExpenseTrend from '../components/ExpenseTrend';
import SearchBar from '../components/SearchBar';
import ExpenseFilters from '../components/ExpenseFilters';
import TransactionList from '../components/TransactionList';
import AIInsights from '../components/AIInsights';
import CSVExport from '../components/CSVExport';

function DashboardContent() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Quick Add Section */}
        <div className="mb-8">
          <QuickAdd />
        </div>

        {/* Summary Cards */}
        <div className="mb-8">
          <SummaryCards />
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ExpenseChart />
          <MonthlyChart />
        </div>

        {/* Spending Trend */}
        <div className="mb-8">
          <ExpenseTrend />
        </div>

        {/* AI Insights */}
        <div className="mb-8">
          <AIInsights />
        </div>

        {/* Transactions Section */}
        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-surface-100">Transactions</h2>
            <div className="flex items-center gap-3">
              <SearchBar />
              <ExpenseFilters />
              <CSVExport />
            </div>
          </div>
          <TransactionList />
        </div>
      </motion.div>
    </div>
  );
}

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ExpenseProvider>
      <DashboardContent />
    </ExpenseProvider>
  );
}
