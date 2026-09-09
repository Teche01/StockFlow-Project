import { useState, useCallback, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import { products as initialProducts } from './data/products';

// ─── localStorage ─────────────────────────────────────────────────────────────
const STORAGE_KEY = 'stockflow_products';

function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // corrupted data — fall back to defaults
  }
  return initialProducts;
}

function saveProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    // quota exceeded or unavailable — silent no-op
  }
}

// ─── page metadata ────────────────────────────────────────────────────────────
const PAGE_META = {
  dashboard: {
    title:    'Inventory Dashboard',
    subtitle: 'Manage and monitor your inventory',
  },
  products: {
    title:    'Products',
    subtitle: 'Manage and view all inventory products',
  },
  inventory: {
    title:    'Inventory Overview',
    subtitle: 'Monitor stock levels and identify items that need attention',
  },
};

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  const [activePage,  setActivePage]  = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /** Shared product list — single source of truth for all pages */
  const [products, setProducts] = useState(loadProducts);

  /** Sync to localStorage whenever products changes */
  useEffect(() => {
    saveProducts(products);
  }, [products]);

  // ── navigation ─────────────────────────────────────────────────────────────
  const handleNavigate = useCallback((page) => {
    setActivePage(page);
    setSidebarOpen(false);
  }, []);

  // ── CRUD handlers (each fires a toast) ────────────────────────────────────

  /** Append a new product */
  const handleAddProduct = useCallback((newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
    toast.success('Product added successfully');
  }, []);

  /** Replace a product by id */
  const handleEditProduct = useCallback((updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    toast.success('Product updated successfully');
  }, []);

  /** Remove a product by id */
  const handleDeleteProduct = useCallback((productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    toast.success('Product deleted successfully');
  }, []);

  /** Restore the original five sample products */
  const handleResetProducts = useCallback(() => {
    setProducts(initialProducts);
    toast.success('Demo data restored successfully');
  }, []);

  // ── page renderer ──────────────────────────────────────────────────────────
  const meta = PAGE_META[activePage] || PAGE_META.dashboard;

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard products={products} />;

      case 'products':
        return (
          <Products
            products={products}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );

      case 'inventory':
        return <Inventory products={products} />;

      default:
        return <Dashboard products={products} />;
    }
  };

  return (
    <>
      {/* Toast notification layer */}
      <Toaster
        position="top-right"
        gutter={10}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color:      '#f1f5f9',
            fontSize:   '13px',
            fontWeight: '500',
            borderRadius: '12px',
            padding:    '12px 16px',
            boxShadow:  '0 10px 15px -3px rgba(0,0,0,0.2)',
          },
          success: {
            iconTheme: { primary: '#34d399', secondary: '#1e293b' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#1e293b' },
          },
        }}
      />

      {/* App shell */}
      <div className="flex h-screen overflow-hidden bg-slate-100">
        {/* Sidebar (handles its own mobile overlay internally) */}
        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header
            title={meta.title}
            subtitle={meta.subtitle}
            onMenuToggle={() => setSidebarOpen((prev) => !prev)}
            products={products}
          />
          <main className="flex-1 overflow-y-auto">
            {renderPage()}
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
