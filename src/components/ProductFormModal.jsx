import { useState, useEffect } from 'react';
import { X, Package, PencilLine, AlertCircle, ChevronDown } from 'lucide-react';

// ─── shared constants & helpers ───────────────────────────────────────────────
export const PRODUCT_CATEGORIES = ['Electronics', 'Furniture', 'Stationery', 'Accessories', 'Other'];

const INITIAL_ERRORS = { name: '', category: '', quantity: '', price: '' };

/** Derive stock status from quantity */
export function getAutoStatus(qty) {
  const n = Number(qty);
  if (n === 0)  return 'Out of Stock';
  if (n <= 10)  return 'Low Stock';
  return 'Available';
}

const statusStyle = {
  'Available':     'text-emerald-600 bg-emerald-50 border-emerald-200',
  'Low Stock':     'text-amber-600 bg-amber-50 border-amber-200',
  'Out of Stock':  'text-red-500 bg-red-50 border-red-200',
};

// ─── reusable Field wrapper ───────────────────────────────────────────────────
function Field({ label, error, required, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
          <AlertCircle size={12} className="flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputBase =
  'w-full border rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all duration-200';
const inputOk    = 'border-slate-200 bg-white hover:border-slate-300 focus:ring-indigo-200 focus:border-indigo-400';
const inputError = 'border-red-300 bg-red-50 focus:ring-red-200';

// ─── ProductFormModal — used for both Add and Edit ────────────────────────────
/**
 * @param {boolean}  isOpen    – controls visibility
 * @param {Function} onClose   – called on cancel / ×
 * @param {Function} onSubmit  – called with the built product object
 * @param {Object}   product   – if provided, pre-fills fields (Edit mode)
 */
function ProductFormModal({ isOpen, onClose, onSubmit, product }) {
  const isEditMode = Boolean(product);

  const [form,    setForm]    = useState({ name: '', category: '', quantity: '', price: '' });
  const [errors,  setErrors]  = useState(INITIAL_ERRORS);
  const [visible, setVisible] = useState(false);

  // Animate in
  useEffect(() => {
    if (isOpen) {
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  // Populate / reset form whenever modal opens
  useEffect(() => {
    if (!isOpen) return;
    setErrors(INITIAL_ERRORS);
    if (isEditMode && product) {
      setForm({
        name:     product.name,
        category: product.category,
        quantity: String(product.quantity),
        price:    String(product.price),
      });
    } else {
      setForm({ name: '', category: '', quantity: '', price: '' });
    }
  }, [isOpen, product, isEditMode]);

  // ── field change ────────────────────────────────────────────────────────────
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // ── validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = { ...INITIAL_ERRORS };
    let ok = true;

    if (!form.name.trim()) {
      e.name = 'Product name is required.'; ok = false;
    }
    if (!form.category) {
      e.category = 'Please select a category.'; ok = false;
    }
    if (
      form.quantity === '' ||
      isNaN(Number(form.quantity)) ||
      Number(form.quantity) < 0 ||
      !Number.isInteger(Number(form.quantity))
    ) {
      e.quantity = 'Quantity must be a whole number (0 or greater).'; ok = false;
    }
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      e.price = 'Price must be greater than ₹0.'; ok = false;
    }

    setErrors(e);
    return ok;
  };

  // ── submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const qty = Number(form.quantity);
    onSubmit({
      // Preserve existing id in edit mode; generate new one for add
      id:       isEditMode ? product.id : Date.now(),
      name:     form.name.trim(),
      category: form.category,
      quantity: qty,
      price:    Number(form.price),
      status:   getAutoStatus(qty),
    });
    onClose();
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  const qtyNum      = Number(form.quantity);
  const showPreview = form.quantity !== '' && !isNaN(qtyNum) && qtyNum >= 0;
  const preview     = showPreview ? getAutoStatus(form.quantity) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pfm-title"
      onClick={handleBackdrop}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        visible ? 'bg-slate-900/50 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ${
          visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isEditMode ? 'bg-violet-50' : 'bg-indigo-50'}`}>
              {isEditMode
                ? <PencilLine size={18} className="text-violet-600" />
                : <Package    size={18} className="text-indigo-600" />
              }
            </div>
            <div>
              <h2 id="pfm-title" className="text-lg font-bold text-slate-800 leading-tight">
                {isEditMode ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEditMode ? 'Update the product details below' : 'Fill in the product details below'}
              </p>
            </div>
          </div>
          <button
            id="pfm-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 py-6 space-y-5">

            {/* Product Name */}
            <Field label="Product Name" error={errors.name} required>
              <input
                id="pfm-name"
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Wireless Keyboard"
                autoFocus
                className={`${inputBase} ${errors.name ? inputError : inputOk}`}
              />
            </Field>

            {/* Category */}
            <Field label="Category" error={errors.category} required>
              <div className="relative">
                <select
                  id="pfm-category"
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className={`${inputBase} appearance-none pr-9 cursor-pointer ${
                    errors.category ? inputError : inputOk
                  } ${!form.category ? 'text-slate-400' : 'text-slate-700'}`}
                >
                  <option value="">Select a category</option>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </Field>

            {/* Quantity + Price */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Quantity" error={errors.quantity} required>
                <input
                  id="pfm-quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={form.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                  placeholder="e.g. 25"
                  className={`${inputBase} ${errors.quantity ? inputError : inputOk}`}
                />
              </Field>

              <Field label="Price (₹)" error={errors.price} required>
                <input
                  id="pfm-price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="e.g. 799"
                  className={`${inputBase} ${errors.price ? inputError : inputOk}`}
                />
              </Field>
            </div>

            {/* Auto-status preview */}
            {showPreview && (
              <div
                className={`flex items-center gap-3 rounded-xl px-4 py-3 border text-xs font-medium transition-all duration-300 ${statusStyle[preview]}`}
              >
                <span className="opacity-70">Auto-detected status:</span>
                <span className="font-bold">{preview}</span>
                <span className="ml-auto opacity-60 font-normal">
                  {qtyNum === 0 ? 'qty = 0' : qtyNum <= 10 ? 'qty ≤ 10' : 'qty > 10'}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex items-center justify-end gap-3">
            <button
              id="pfm-cancel-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              id="pfm-submit-btn"
              type="submit"
              className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl active:scale-95 shadow-sm hover:shadow-md transition-all duration-200 ${
                isEditMode
                  ? 'bg-violet-600 hover:bg-violet-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isEditMode ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormModal;
