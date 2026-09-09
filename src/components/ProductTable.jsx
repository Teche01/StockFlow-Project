import { Package2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

const categoryColors = {
  Electronics: 'bg-indigo-50 text-indigo-700',
  Furniture: 'bg-violet-50 text-violet-700',
  Stationery: 'bg-teal-50 text-teal-700',
};

function ProductTable({ products }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Section header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Recent Products</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Overview of recently added inventory items
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-slate-400 font-medium">{products.length} items</span>
        </div>
      </div>

      {/* Table wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                Product Name
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                Category
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                Quantity
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                Price
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-slate-50 transition-colors duration-150 group"
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
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${categoryColors[product.category] || 'bg-slate-100 text-slate-600'}`}
                  >
                    {product.category}
                  </span>
                </td>

                {/* Quantity */}
                <td className="px-6 py-4">
                  <span
                    className={`font-semibold text-sm ${
                      product.quantity === 0
                        ? 'text-red-500'
                        : product.quantity <= 10
                        ? 'text-amber-600'
                        : 'text-slate-700'
                    }`}
                  >
                    {product.quantity === 0 ? '—' : product.quantity}
                  </span>
                </td>

                {/* Price */}
                <td className="px-6 py-4">
                  <span className="font-semibold text-slate-700">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
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
          Showing {products.length} of {products.length} products
        </p>
      </div>
    </section>
  );
}

export default ProductTable;
