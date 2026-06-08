import { Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { useExpenses } from '../context/ExpenseContext';
import { format } from 'date-fns';

export default function CSVExport() {
  const { transactions } = useExpenses();

  const exportCSV = () => {
    if (transactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    const headers = ['Date', 'Amount', 'Category', 'Description', 'Original Text'];
    const rows = transactions.map((t) => [
      format(new Date(t.date), 'yyyy-MM-dd'),
      t.amount.toString(),
      t.category,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.rawText.replace(/"/g, '""')}"`,
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spendwise-expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Exported successfully');
  };

  return (
    <button onClick={exportCSV} className="btn-secondary text-sm flex items-center gap-2">
      <Download size={16} />
      Export CSV
    </button>
  );
}
