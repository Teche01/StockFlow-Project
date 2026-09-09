import { useMemo } from 'react';
import {
  Boxes,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Package2,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';

// ─── constants ────────────────────────────────────────────────────────────────

/** Quantity considered "full" for the progress bar (= 100%) */
const MAX_STOCK_UNITS = 50;

const categoryColors = {
  Electronics: 'bg-indigo-50 text-indigo-700',
  Furniture:   'bg-violet-50 text-violet-700',
  Stationery:  'bg-teal-50 text-teal-700',
  Accessories: 'bg-pink-50 text-pink-700',
  Other:       'bg-slate-100 text-slate-600',
};

// ─── sub-components ───────────────────────────────────────────────────────────

/**
 * Horizontal progress bar that maps a product's quantity to a visual fill.
 * Scale: 0 qty → 0 %, MAX_STOCK_UNITS qty → 100 % (capped).
 */
function StockBar({ quantity, status }) {
  const pct = Math.min(Math.round((quantity / MAX_STOCK_UNITS) * 100), 100);

  const barColor = {
    Available:      'bg-emerald-400',
    'Low Stock':    'bg-amber-400',
    'Out of Stock': 'bg-red-300',
  }[status] || 'bg-slate-300';

  const trackColor = {
    Available:      'bg-emerald-50',
    'Low Stock':    'bg-amber-50',
    'Out of Stock': 'bg-red-50',
  }[status] || 'bg-slate-100';

  return (
    <div className="flex items-center gap-3 min-w-[160px]">
      <div className={`flex-1 h-2 rounded-full overflow-hidden ${trackColor}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-500 w-9 text-right tabular-nums">
        {pct}%
      </span>
    </div>
  );
}

/**
 * A single alert card shown in the Stock Alerts section.
 */
function AlertCard({ product }) {
  const isOut = product.status === 'Out of Stock';

  return (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/70 transition-colors duration-150 group">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isOut ? 'bg-red-50' : 'bg-amber-50'
        }`}>
          {isOut
            ? <XCircle     size={18} className="text-red-500"   />
            : <AlertTriangle size={18} className="text-amber-500" />
          }
        </div>

        {/* Text */}
        <div>
          <p className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors duration-150">
            {product.name}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {isOut
              ? 'No stock available'
              : `Only ${product.quantity} unit${product.quantity !== 1 ? 's' : ''} remaining`
            }
          </p>
        </div>
      </div>

      <StatusBadge status={product.status} />
    </div>
  );
}

// ─── stat card definitions ────────────────────────────────────────────────────
const CARD_DEFS = [
  {
    id:        'units',
    title:     'Total Stock Units',
    description: 'Sum of all quantities',
    icon:      Boxes,
    iconBg:    'bg-indigo-50',
    iconColor: 'text-indigo-600',
    accent:    'bg-indigo-400',
    stat:      'totalUnits',
  },
  {
    id:        'available',
    title:     'Available Products',
    description: 'In stock & ready',
    icon:      CheckCircle2,
    iconBg:    'bg-emerald-50',
    iconColor: 'text-emerald-600',
    accent:    'bg-emerald-400',
    stat:      'available',
  },
  {
    id:        'lowstock',
    title:     'Low Stock Products',
    description: 'Needs restocking soon',
    icon:      AlertTriangle,
    iconBg:    'bg-amber-50',
    iconColor: 'text-amber-600',
    accent:    'bg-amber-400',
    stat:      'lowStock',
  },
  {
    id:        'outofstock',
    title:     'Out of Stock',
    description: 'Unavailable items',
    icon:      XCircle,
    iconBg:    'bg-red-50',
    iconColor: 'text-red-500',
    accent:    'bg-red-400',
    stat:      'outOfStock',
  },
];

// ─── main component ───────────────────────────────────────────────────────────
/**
 * Inventory page.
 * @param {Array} products - Shared product list from App state (auto-updates).
 */
function Inventory({ products }) {
  // ── computed stats ──────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    totalUnits: products.reduce((sum, p) => sum + p.quantity, 0),
    available:  products.filter((p) => p.status === 'Available').length,
    lowStock:   products.filter((p) => p.status === 'Low Stock').length,
    outOfStock: products.filter((p) => p.status === 'Out of Stock').length,
  }), [products]);

  // Alerts: Out of Stock first, then Low Stock, then by quantity ascending
  const alerts = useMemo(() =>
    products
      .filter((p) => p.status === 'Low Stock' || p.status === 'Out of Stock')
      .sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === 'Out of Stock' ? -1 : 1;
        }
        return a.quantity - b.quantity;
      }),
    [products]
  );

  return (
    <div className="p-8 space-y-8">

      {/* ── Summary stat cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {CARD_DEFS.map((card) => (
          <StatCard key={card.id} {...card} value={stats[card.stat]} />
        ))}
      </div>

      {/* ── Stock monitoring table ──────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Section header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Stock Monitoring</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Current stock levels for all products
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="text-xs text-slate-400 font-medium">
              {products.length} products
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Product Name', 'Category', 'Current Stock', 'Stock Level', 'Status'].map((col) => (
                  <th
                    key={col}
                    className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/70 transition-colors duration-150 group"
                >
                  {/* Product Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors duration-200">
                        <Package2 size={14} className="text-indigo-500" />
                      </div>
                      <span className="font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors duration-200">
                        {product.name}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${categoryColors[product.category] || 'bg-slate-100 text-slate-600'}`}>
                      {product.category}
                    </span>
                  </td>

                  {/* Current Stock */}
                  <td className="px-6 py-4">
                    <span className={`font-bold text-sm ${
                      product.quantity === 0  ? 'text-red-500'
                      : product.quantity <= 10 ? 'text-amber-600'
                      : 'text-slate-700'
                    }`}>
                      {product.quantity === 0
                        ? '0 units'
                        : `${product.quantity} unit${product.quantity !== 1 ? 's' : ''}`
                      }
                    </span>
                  </td>

                  {/* Stock Level (progress bar) */}
                  <td className="px-6 py-4">
                    <StockBar quantity={product.quantity} status={product.status} />
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={product.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
          <p className="text-xs text-slate-400 font-medium">
            {products.length} products monitored · Progress bars scaled to {MAX_STOCK_UNITS} units = 100%
          </p>
        </div>
      </section>

      {/* ── Stock Alerts ────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Section header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Stock Alerts</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Products that require immediate attention
            </p>
          </div>

          {alerts.length > 0 && (
            <div className="flex items-center gap-2">
              {/* Out of Stock badge */}
              {stats.outOfStock > 0 && (
                <span className="bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-red-200">
                  {stats.outOfStock} out of stock
                </span>
              )}
              {/* Low Stock badge */}
              {stats.lowStock > 0 && (
                <span className="bg-amber-50 text-amber-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200">
                  {stats.lowStock} low stock
                </span>
              )}
            </div>
          )}
        </div>

        {alerts.length > 0 ? (
          <>
            <div className="divide-y divide-slate-50">
              {alerts.map((product) => (
                <AlertCard key={product.id} product={product} />
              ))}
            </div>

            {/* Alert footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
              <p className="text-xs text-slate-400 font-medium">
                {stats.outOfStock} out of stock · {stats.lowStock} low stock · {stats.available} available
              </p>
            </div>
          </>
        ) : (
          /* ── All-clear state ── */
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
              <CheckCircle2 size={26} className="text-emerald-500" />
            </div>
            <p className="text-base font-bold text-slate-700">All products have sufficient stock.</p>
            <p className="text-sm text-slate-400 mt-1">No stock alerts at this time.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Inventory;
