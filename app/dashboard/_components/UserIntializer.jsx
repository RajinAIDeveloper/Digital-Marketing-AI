'use client';

import { useEffect } from 'react';
import { useAuthStore } from "@/store/auth-store";

export default function UserInitializer({ userData }) {
  const setUser = useAuthStore((state) => state.setUser);
  const setRole = useAuthStore((state) => state.setRole);
  
  useEffect(() => {
    if (userData && Array.isArray(userData) && userData[0]) {
      const user = userData[0];
      console.log('🔄 Setting user data:', { 
        fullName: user.fullName,
        userType: user.userType 
      });
      
      setUser(user);
      setRole(user.userType);
    }
  }, [userData, setUser, setRole]);

  return null;
}