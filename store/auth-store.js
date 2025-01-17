import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      role: null,

      // Actions
      setUser: (user) => set({ user }),
      setRole: (role) => set({ role }),
      clearUser: () => set({ user: null, role: null }),
    }),
    {
      name: 'auth-store',
      // Specify which parts of the state to persist
      partialize: (state) => ({ 
        user: state.user,
        role: state.role 
      }),
    }
  )
);