'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';

export function AuthProvider({ children, userData }) {
  const setUser = useAuthStore((state) => state.setUser);
  const setRole = useAuthStore((state) => state.setRole);
  
  useEffect(() => {
    if (userData && Array.isArray(userData) && userData[0]) {
      const user = userData[0];
      console.log('Initializing auth store with:', user);
      
      // Initialize store
      setUser(user);
      setRole(user.userType);
    }
  }, [userData, setUser, setRole]);

  return children;
}