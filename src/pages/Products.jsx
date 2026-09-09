import { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  Package2,
  SlidersHorizontal,
  PackageSearch,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import ProductFormModal from '../components/ProductFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

// ─── constants ────────────────────────────────────────────────────────────────
const FILTER_CATEGORIES = ['All Categories', 'Electronics', 'Furniture', 'Stationery', 'Accessories', 'Other'];
const STATUSES          = ['All Status', 'Available', 'Low Stock', 'Out of Stock'];

const categoryColors = {
  Electronics: 'bg-indigo-50 text-indigo-700',
  Furniture:   'bg-violet-50 text-violet-700',
  Stationery:  'bg-teal-50 text-teal-700',
  Accessories: 'bg-pink-50 text-pink-700',
  Other:       'bg-slate-100 text-slate-600',
};

// ─── sub-components ───────────────────────────────────────────────────────────

function FilterSelect({ id, value, onChange, options }) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl pl-4 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200 cursor-pointer shadow-sm"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown
        size={15}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────
/**
 * @param {Array}    products        - Shared product list from App state
 * @param {Function} onAddProduct    - Append a new product
 * @param {Function} onEditProduct   - Replace a product by id
 * @param {Function} onDeleteProduct - Remove a product by id
 */
function Products({ products, onAddProduct, onEditProduct, onDeleteProduct }) {
  // ── filter state ────────────────────────────────────────────────────────────
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All Categories');
  const [status,   setStatus]   = useState('All Status');

  // ── modal state ──────────────────────────────────────────────────────────────
  const [addOpen,       setAddOpen]       = useState(false);
  const [editProduct,   setEditProduct]   = useState(null);   // product obj or null
  const [deleteProduct, setDeleteProduct] = useState(null);   // product obj or null

  // ── derived ─────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchSearch   = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const matchCategory = category === 'All Categories' || p.category === category;
      const matchStatus   = status   === 'All Status'     || p.status   === status;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, search, category, status]);

  const hasActiveFilter = search || category !== 'All Categories' || status !== 'All Status';

  const clearFilters = () => {
    setSearch('');
    setCategory('All Categories');
    setStatus('All Status');
  };

  // ── modal handlers ───────────────────────────────────────────────────────────
  const openEdit   = (product) => setEditProduct(product);
  const closeEdit  = ()        => setEditProduct(null);

  const openDelete   = (product) => setDeleteProduct(product);
  const closeDelete  = ()        => setDeleteProduct(null);

  return (
    <>
      <div className="px-6 sm:px-8 pt-6 pb-8 space-y-6">

        {/* ── Add Product button row ────────────────────────────────────────── */}
        <div className="flex justify-end">
          <button
            id="add-product-btn"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:bg-indigo-700 hover:shadow-md active:scale-95 transition-all duration-200"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>

        {/* ── Search + Filters ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">

            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                id="product-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200 placeholder:text-slate-400"
              />
            </div>

            <div className="hidden sm:block w-px h-8 bg-slate-200 self-center" />

            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <SlidersHorizontal size={15} />
              <span className="text-xs font-medium">Filters</span>
            </div>

            <FilterSelect
              id="category-filter"
              value={category}
              onChange={setCategory}
              options={FILTER_CATEGORIES}
            />

            <FilterSelect
              id="status-filter"
              value={status}
              onChange={setStatus}
              options={STATUSES}
            />

            {hasActiveFilter && (
              <button
                id="clear-filters-btn"
                onClick={clearFilters}
                className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-2 rounded-xl hover:bg-indigo-100 transition-all duration-200 whitespace-nowrap"
              >
                Clear all
              </button>
            )}
          </div>

          {hasActiveFilter && (
            <p className="text-xs text-slate-400 mt-3 pl-1">
              Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of{' '}
              <span className="font-semibold text-slate-600">{products.length}</span> products
            </p>
          )}
        </div>

        {/* ── Products table ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">All Products</h2>
              <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                {filtered.length}
              </span>
            </div>
          </div>

          {filtered.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {['Product Name', 'Category', 'Quantity', 'Price', 'Status', 'Actions'].map((col) => (
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
                    {filtered.map((product) => (
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

                        {/* Quantity */}
                        <td className="px-6 py-4">
                          <span className={`font-semibold text-sm ${
                            product.quantity === 0 ? 'text-red-500'
                            : product.quantity <= 10 ? 'text-amber-600'
                            : 'text-slate-700'
                          }`}>
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

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {/* Edit */}
                            <button
                              id={`edit-product-${product.id}`}
                              title="Edit product"
                              aria-label={`Edit ${product.name}`}
                              onClick={() => openEdit(product)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 text-slate-400 border border-slate-200 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-all duration-200"
                            >
                              <Pencil size={13} />
                            </button>

                            {/* Delete */}
                            <button
                              id={`delete-product-${product.id}`}
                              title="Delete product"
                              aria-label={`Delete ${product.name}`}
                              onClick={() => openDelete(product)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 text-slate-400 border border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all duration-200"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
                <p className="text-xs text-slate-400 font-medium">
                  Showing {filtered.length} of {products.length} products
                </p>
              </div>
            </>
          ) : products.length === 0 ? (
            /* ── Completely empty list ── */
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                <Package2 size={28} className="text-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-slate-700 mb-1">
                No inventory products available
              </h3>
              <p className="text-sm text-slate-400 max-w-xs">
                Add your first product to start managing inventory.
              </p>
              <button
                onClick={() => setAddOpen(true)}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 px-4 py-2.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all duration-200 shadow-sm"
              >
                <Plus size={15} />
                Add First Product
              </button>
            </div>
          ) : (
            /* ── Filters returned no match ── */
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <PackageSearch size={28} className="text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-700 mb-1">No products found</h3>
              <p className="text-sm text-slate-400 max-w-xs">
                Try changing your search or filters.
              </p>
              {hasActiveFilter && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all duration-200"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Add Product modal ─────────────────────────────────────────────── */}
      <ProductFormModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={onAddProduct}
        product={null}
      />

      {/* ── Edit Product modal ────────────────────────────────────────────── */}
      <ProductFormModal
        isOpen={Boolean(editProduct)}
        onClose={closeEdit}
        onSubmit={onEditProduct}
        product={editProduct}
      />

      {/* ── Delete confirmation modal ─────────────────────────────────────── */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteProduct)}
        onClose={closeDelete}
        onDelete={onDeleteProduct}
        product={deleteProduct}
      />
    </>
  );
}

export default Products;
