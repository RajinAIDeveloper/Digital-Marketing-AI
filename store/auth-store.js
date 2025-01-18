// store/use-auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/db/schema';

export const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      role: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null, role: null }),
      setRole: (role) => set({ role }),
    }),
    {
      name: 'auth-store',
    }
  )
);