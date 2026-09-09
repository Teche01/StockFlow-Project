// StatusBadge: renders a colored pill badge for product status
function StatusBadge({ status }) {
  const styles = {
    'Available': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'Low Stock': 'bg-amber-50 text-amber-700 border border-amber-200',
    'Out of Stock': 'bg-red-50 text-red-600 border border-red-200',
  };

  const dots = {
    'Available': 'bg-emerald-500',
    'Low Stock': 'bg-amber-500',
    'Out of Stock': 'bg-red-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-slate-100 text-slate-600 border border-slate-200'}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || 'bg-slate-400'}`} />
      {status}
    </span>
  );
}

export default StatusBadge;
