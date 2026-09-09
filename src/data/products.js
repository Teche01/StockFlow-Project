// Sample product data for the StockFlow dashboard

export const products = [
  {
    id: 1,
    name: 'Wireless Mouse',
    category: 'Electronics',
    quantity: 25,
    price: 799,
    status: 'Available',
  },
  {
    id: 2,
    name: 'Keyboard',
    category: 'Electronics',
    quantity: 8,
    price: 1499,
    status: 'Low Stock',
  },
  {
    id: 3,
    name: 'Office Chair',
    category: 'Furniture',
    quantity: 0,
    price: 5499,
    status: 'Out of Stock',
  },
  {
    id: 4,
    name: 'Notebook',
    category: 'Stationery',
    quantity: 40,
    price: 120,
    status: 'Available',
  },
  {
    id: 5,
    name: 'Monitor',
    category: 'Electronics',
    quantity: 6,
    price: 12999,
    status: 'Low Stock',
  },
];

export const summaryStats = {
  totalProducts: 5,
  available: 2,
  lowStock: 2,
  outOfStock: 1,
};
