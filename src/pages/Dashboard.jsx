import { useMemo } from 'react';
import { Boxes, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import ProductTable from '../components/ProductTable';

// Static card metadata — icons, labels, accent colours never change
const CARD_DEFS = [
  {
    id:          'total',
    title:       'Total Products',
    description: 'All SKUs in catalog',
    icon:        Boxes,
    iconBg:      'bg-indigo-50',
    iconColor:   'text-indigo-600',
    accent:      'bg-indigo-400',
    stat:        'total',
  },
  {
    id:          'available',
    title:       'Available Products',
    description: 'In stock & ready',
    icon:        CheckCircle2,
    iconBg:      'bg-emerald-50',
    iconColor:   'text-emerald-600',
    accent:      'bg-emerald-400',
    stat:        'available',
  },
  {
    id:          'lowstock',
    title:       'Low Stock',
    description: 'Needs restocking soon',
    icon:        AlertTriangle,
    iconBg:      'bg-amber-50',
    iconColor:   'text-amber-600',
    accent:      'bg-amber-400',
    stat:        'lowStock',
  },
  {
    id:          'outofstock',
    title:       'Out of Stock',
    description: 'Unavailable items',
    icon:        XCircle,
    iconBg:      'bg-red-50',
    iconColor:   'text-red-500',
    accent:      'bg-red-400',
    stat:        'outOfStock',
  },
];

/**
 * Dashboard page.
 * @param {Array} products - Shared product list passed down from App.
 */
function Dashboard({ products }) {
  // Compute stats live whenever the products array changes
  const stats = useMemo(() => ({
    total:      products.length,
    available:  products.filter((p) => p.status === 'Available').length,
    lowStock:   products.filter((p) => p.status === 'Low Stock').length,
    outOfStock: products.filter((p) => p.status === 'Out of Stock').length,
  }), [products]);

  return (
    <div className="p-8 space-y-8">
      {/* Summary stat cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {CARD_DEFS.map((card) => (
          <StatCard key={card.id} {...card} value={stats[card.stat]} />
        ))}
      </div>

      {/* Recent products table — shows same shared data */}
      <ProductTable products={products} />
    </div>
  );
}

export default Dashboard;
