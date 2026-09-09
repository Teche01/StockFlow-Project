import { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

/**
 * DeleteConfirmModal — asks the user to confirm before deleting a product.
 *
 * @param {boolean}  isOpen   – controls visibility
 * @param {Function} onClose  – called on Cancel / ×
 * @param {Function} onDelete – called when user confirms deletion
 * @param {Object}   product  – the product targeted for deletion
 */
function DeleteConfirmModal({ isOpen, onClose, onDelete, product }) {
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

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleConfirm = () => {
    if (product) onDelete(product.id);
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="del-modal-title"
      onClick={handleBackdrop}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        visible ? 'bg-slate-900/50 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ${
          visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div className="flex items-start gap-4">
            {/* Warning icon */}
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <div>
              <h2 id="del-modal-title" className="text-lg font-bold text-slate-800 leading-tight">
                Delete Product?
              </h2>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
            </div>
          </div>
          <button
            id="del-modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200 flex-shrink-0 ml-2"
          >
            <X size={18} />
          </button>
        </div>

        {/* Product name pill */}
        <div className="mx-6 mb-5">
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <Trash2 size={14} className="text-red-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-medium">Product to be deleted</p>
              <p className="text-sm font-bold text-slate-700 truncate">{product.name}</p>
            </div>
            <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
              product.status === 'Available'
                ? 'bg-emerald-50 text-emerald-700'
                : product.status === 'Low Stock'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-red-50 text-red-600'
            }`}>
              {product.status}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex items-center justify-end gap-3">
          <button
            id="del-cancel-btn"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            id="del-confirm-btn"
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 active:scale-95 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Trash2 size={14} />
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
