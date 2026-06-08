import { Filter } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'Food', label: 'Food' },
  { value: 'Transport', label: 'Transport' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Bills', label: 'Bills' },
  { value: 'Health', label: 'Health' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Education', label: 'Education' },
  { value: 'Miscellaneous', label: 'Miscellaneous' },
];

export default function ExpenseFilters() {
  const { filters, setFilters } = useExpenses();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-surface-500">
        <Filter size={16} />
        <span className="text-sm">Filter:</span>
      </div>
      <select
        value={filters.category}
        onChange={(e) => setFilters({ category: e.target.value })}
        className="glass-input text-sm py-2 pr-10 cursor-pointer"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value} className="bg-surface-800">
            {cat.label}
          </option>
        ))}
      </select>
    </div>
  );
}
