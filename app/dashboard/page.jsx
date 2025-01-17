'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);

  useEffect(() => {
    // Wait for user data to be available
    if (user && role) {
      console.log('🔄 Redirecting based on role:', role);
      
      if (role === 'admin') {
        redirect('/dashboard/admin');
      } else {
        redirect('/dashboard/seller');
      }
    }
  }, [user, role]);

  // Show loading state while checking role
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">Loading dashboard...</h2>
        <p className="text-sm text-gray-500 mt-2">Please wait while we redirect you</p>
      </div>
    </div>
  );
}