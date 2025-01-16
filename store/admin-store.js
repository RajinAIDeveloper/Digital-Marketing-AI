// store/use-admin-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Sale } from '@/db/schema';



export const useAdminStore = create()(
  persist(
    (set) => ({
      sellers: [],
      commissionPayments: [],

      setSellers: (sellers) => set({ sellers }),
      addSeller: (seller) => 
        set((state) => ({ 
          sellers: [...state.sellers, seller]
        })),
      updateSeller: (id, updates) =>
        set((state) => ({
          sellers: state.sellers.map(seller =>
            seller.id === id ? { ...seller, ...updates } : seller
          )
        })),
      deleteSeller: (id) =>
        set((state) => ({
          sellers: state.sellers.filter(seller => seller.id !== id)
        })),

      setCommissionPayments: (payments) => set({ commissionPayments: payments }),
      addCommissionPayment: (payment) =>
        set((state) => ({
          commissionPayments: [...state.commissionPayments, payment]
        })),
      updateCommissionPayment: (id, updates) =>
        set((state) => ({
          commissionPayments: state.commissionPayments.map(payment =>
            payment.id === id ? { ...payment, ...updates } : payment
          )
        })),
    }),
    {
      name: 'admin-store',
    }
  )
);