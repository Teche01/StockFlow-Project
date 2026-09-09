import { LayoutDashboard, Package, Warehouse, X } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products',  label: 'Products',  icon: Package },
  { id: 'inventory', label: 'Inventory', icon: Warehouse },
];

/**
 * Left sidebar — static on desktop, slide-in overlay on mobile.
 *
 * @param {string}   activePage  - Currently active page id
 * @param {Function} onNavigate  - Called with the new page id
 * @param {boolean}  isOpen      - Controls mobile visibility
 * @param {Function} onClose     - Closes sidebar on mobile
 */
function Sidebar({ activePage, onNavigate, isOpen, onClose }) {
  const handleNavClick = (id) => {
    onNavigate(id);
    onClose();            // close overlay on mobile after navigation
  };

  return (
    <>
      {/* ── Mobile backdrop ─────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar panel ───────────────────────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-40 w-64 bg-white border-r border-slate-200
          flex flex-col shadow-sm transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md flex-shrink-0">
              <Warehouse size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">StockFlow</h1>
              <p className="text-xs text-slate-400 font-medium leading-tight">Inventory System</p>
            </div>
          </div>

          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-3 mb-3">
            Main Menu
          </p>

          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activePage === id;
            return (
              <button
                key={id}
                id={`nav-${id}`}
                onClick={() => handleNavClick(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group cursor-pointer
                  ${isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-lg
                    transition-colors duration-200 flex-shrink-0
                    ${isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'
                    }`}
                >
                  <Icon size={16} />
                </span>
                <span>{label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

      </aside>
    </>
  );
}

export default Sidebar;
