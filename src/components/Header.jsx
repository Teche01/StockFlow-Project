import { useState, useMemo, useRef, useEffect } from 'react';
import { Bell, Menu, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * Top header bar with hamburger (mobile), page title, and a functional
 * notification bell that shows live stock alerts from the shared product list.
 *
 * @param {string}   title          - Page title
 * @param {string}   subtitle       - Page subtitle
 * @param {Function} onMenuToggle   - Opens/closes the mobile sidebar
 * @param {Array}    products       - Shared product list (for alert computation)
 */
function Header({
  title      = 'Inventory Dashboard',
  subtitle   = 'Manage and monitor your inventory',
  onMenuToggle,
  products   = [],
}) {
  const [bellOpen, setBellOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ── compute alerts from shared state ────────────────────────────────────────
  const alerts = useMemo(
    () =>
      products
        .filter((p) => p.status === 'Low Stock' || p.status === 'Out of Stock')
        .sort((a, b) => {
          // Out of Stock first, then Low Stock sorted by quantity ascending
          if (a.status !== b.status) return a.status === 'Out of Stock' ? -1 : 1;
          return a.quantity - b.quantity;
        }),
    [products]
  );

  const alertCount = alerts.length;

  // ── close dropdown when clicking outside ────────────────────────────────────
  useEffect(() => {
    if (!bellOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [bellOpen]);

  return (
    <header className="bg-white border-b border-slate-200 px-5 sm:px-8 py-4 sm:py-5 flex items-center gap-4 sticky top-0 z-20">

      {/* Hamburger — mobile only */}
      <button
        id="sidebar-toggle-btn"
        onClick={onMenuToggle}
        aria-label="Open navigation menu"
        className="md:hidden w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-200 flex-shrink-0"
      >
        <Menu size={18} />
      </button>

      {/* Title block */}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight truncate">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">{subtitle}</p>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3 flex-shrink-0">

        {/* ── Notification bell ──────────────────────────────────────────────── */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="notification-btn"
            onClick={() => setBellOpen((prev) => !prev)}
            aria-label={`Stock alerts — ${alertCount} item${alertCount !== 1 ? 's' : ''}`}
            aria-expanded={bellOpen}
            className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all duration-200 ${
              bellOpen
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
            }`}
          >
            <Bell size={17} />

            {/* Badge — only shown when there are alerts */}
            {alertCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none border-2 border-white">
                {alertCount > 99 ? '99+' : alertCount}
              </span>
            )}
          </button>

          {/* ── Dropdown panel ──────────────────────────────────────────────── */}
          {bellOpen && (
            <div
              role="dialog"
              aria-label="Stock alerts panel"
              className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50"
            >
              {/* Panel header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-800">Stock Alerts</h3>
                  {alertCount > 0 && (
                    <span className="bg-red-50 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full border border-red-200">
                      {alertCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setBellOpen(false)}
                  aria-label="Close alerts panel"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200"
                >
                  ✕
                </button>
              </div>

              {/* Alert list */}
              {alertCount > 0 ? (
                <>
                  <div className="overflow-y-auto max-h-72 divide-y divide-slate-50">
                    {alerts.map((product) => {
                      const isOut = product.status === 'Out of Stock';
                      return (
                        <div
                          key={product.id}
                          className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors duration-150"
                        >
                          {/* Icon */}
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isOut ? 'bg-red-50' : 'bg-amber-50'
                          }`}>
                            {isOut
                              ? <XCircle      size={15} className="text-red-500"   />
                              : <AlertTriangle size={15} className="text-amber-500" />
                            }
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-700 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {isOut
                                ? 'No stock available'
                                : `Only ${product.quantity} unit${product.quantity !== 1 ? 's' : ''} remaining`
                              }
                            </p>
                          </div>

                          {/* Status badge */}
                          <div className="flex-shrink-0 mt-0.5">
                            <StatusBadge status={product.status} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Panel footer */}
                  <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100">
                    <p className="text-xs text-slate-400 font-medium">
                      {alerts.filter(p => p.status === 'Out of Stock').length} out of stock ·{' '}
                      {alerts.filter(p => p.status === 'Low Stock').length} low stock
                    </p>
                  </div>
                </>
              ) : (
                /* ── No-alerts state ── */
                <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
                    <CheckCircle2 size={22} className="text-emerald-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">No stock alerts</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                    All products have sufficient stock.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-semibold text-slate-700 leading-tight">Admin User</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
          <div
            id="user-avatar"
            title="Admin User"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 flex-shrink-0"
          >
            <span className="text-white text-sm font-bold select-none">A</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
