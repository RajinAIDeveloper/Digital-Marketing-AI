// store/use-seller-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Sale, OperationHistory } from '@/db/schema';



export const useSellerStore = create()(
  persist(
    (set) => ({
      products: [],
      sales: [],
      operations: [],

      setProducts: (products) => set({ products }),
      addProduct: (product) => 
        set((state) => ({
          products: [...state.products, product]
        })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map(product =>
            product.id === id ? { ...product, ...updates } : product
          )
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter(product => product.id !== id)
        })),

      setSales: (sales) => set({ sales }),
      addSale: (sale) =>
        set((state) => ({
          sales: [...state.sales, sale]
        })),
      updateSaleStatus: (id, status) =>
        set((state) => ({
          sales: state.sales.map(sale =>
            sale.id === id ? { ...sale, status } : sale
          )
        })),

      addOperation: (operation) =>
        set((state) => ({
          operations: [...state.operations, operation]
        })),
    }),
    {
      name: 'seller-store',
    }
  )
);


// Selectors for common calculations
export const useSellerSelectors = {
  getTotalCommission: () => {
    const { sales } = useSellerStore.getState();
    return sales.reduce((total, sale) => total + sale.commission, 0);
  },

  getPendingCommission: () => {
    const { sales } = useSellerStore.getState();
    return sales
      .filter((sale) => sale.status === 'pending')
      .reduce((total, sale) => total + sale.commission, 0);
  },

  getProductStats: (productId) => {
    const { sales, products } = useSellerStore.getState();
    const product = products.find((p) => p.id === productId);
    const productSales = sales.filter((s) => s.productId === productId);
    
    return {
      totalSales: productSales.length,
      totalQuantitySold: productSales.reduce((total, sale) => total + sale.quantity, 0),
      totalRevenue: productSales.reduce((total, sale) => total + sale.totalAmount, 0),
      totalCommission: productSales.reduce((total, sale) => total + sale.commission, 0),
      currentStock: product?.quantity || 0,
    };
  },
};