import { Search, X } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

export default function SearchBar() {
  const { filters, setFilters } = useExpenses();

  return (
    <div className="relative">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500" />
      <input
        type="text"
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
        placeholder="Search transactions..."
        className="glass-input w-full pl-11 pr-10 text-sm"
      />
      {filters.search && (
        <button
          onClick={() => setFilters({ search: '' })}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
